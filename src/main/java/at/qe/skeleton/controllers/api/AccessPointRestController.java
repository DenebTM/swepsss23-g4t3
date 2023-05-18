package at.qe.skeleton.controllers.api;

import at.qe.skeleton.configs.jwtutils.JwtManager;
import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.PostAccessPointResponse;
import at.qe.skeleton.models.enums.AccessPointStatus;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.services.AccessPointService;
import at.qe.skeleton.services.LoggingService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;

@RestController
public class AccessPointRestController implements BaseRestController {

    @Autowired
    private AccessPointService apService;

    @Autowired
    private JwtManager tokenManager;

    @Autowired
    private LoggingService logger;

    public static final String AP = "Access point";
    private static final String AP_PATH = "/access-points";
    public static final String AP_NAME_PATH = AP_PATH + "/{name}";


    /**
     * Route to GET all access points, available for all users
     * @return List of all access points
     */
    @GetMapping(value = AP_PATH)
    public ResponseEntity<Collection<AccessPoint>> getAllAccessPoints() {
        return ResponseEntity.ok(apService.getAllAP());
    }

    /**
     * Route to GET a specific access point by its ID
     * @param name
     * @return access point
     */
    @GetMapping(value = AP_NAME_PATH)
    public ResponseEntity<AccessPoint> getAPByName(@PathVariable(value = "name") String name) {
        AccessPoint ap = apService.loadAPByName(name);
        // Return a 404 error if the access point is not found
        if (ap == null) {
            throw new NotFoundInDatabaseException(AP, name);
        }
        apService.setLastUpdate(ap);
        return ResponseEntity.ok(ap);
    }

    /**
     * POST route to create a new Access Point
     * @param json body
     * @return newly created ap
     */
    @PostMapping(value = AP_PATH)
    public ResponseEntity<PostAccessPointResponse> createAP(
        @RequestBody Map<String, Object> json,
        HttpServletRequest request
    ) {
        String name = (String)json.get("name");
        if (name == null || name.equals("")) {
            throw new BadRequestException("No name given");
        }

        String serverAddress = (String)json.get("serverAddress");
        if (serverAddress == null || serverAddress.equals("")) {
            throw new BadRequestException("No server address given");
        }

        AccessPoint ap = apService.loadAPByName(name);

        // 401 and no token if access point is new or not yet confirmed
        if (ap == null || ap.getStatus().equals(AccessPointStatus.UNCONFIRMED)) {
            if (ap == null) {
                ap = apService.saveAP(new AccessPoint(
                    name,
                    serverAddress,
                    AccessPointStatus.UNCONFIRMED
                ));

                logger.info("New access point added", LogEntityType.ACCESS_POINT, ap.getName(), getClass());
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new PostAccessPointResponse(ap, null)
            );
        } 

        ap.setServerAddress(serverAddress);
        ap.setClientAddress(request.getRemoteAddr());

        // 200 and new JWT if access point exists with status != 'UNCONFIRMED'
        // furthermore, update AP status to ONLINE
        if (ap.getStatus().equals(AccessPointStatus.OFFLINE)) {
            ap.setStatus(AccessPointStatus.ONLINE);
        }

        ap = apService.saveAP(ap);
        apService.setLastUpdate(ap);

        String authToken = tokenManager.generateJwtToken("admin");
        return ResponseEntity.ok(new PostAccessPointResponse(ap, authToken));
    }

    /**
     * a PUT route to update an existing access point
     * @param name
     * @param json
     * @return updated access point
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping(value = AP_NAME_PATH)
    public ResponseEntity<AccessPoint> updateAP(@PathVariable(value = "name") String name,  @RequestBody Map<String, Object> json) {
        AccessPoint ap = apService.loadAPByName(name);
        // return a 404 error if the access point to be updated does not exist
        if (ap == null) {
            throw new NotFoundInDatabaseException(AP, name);
        }
        // return a 400 error if the username is part of the json body, because it cannot be updated
        if (json.containsKey("name")) {
            throw new BadRequestException("AP names are final and cannot be changed");
        }
        if (json.containsKey("status")) {
            try {
                AccessPointStatus oldStatus = ap.getStatus();
                AccessPointStatus newStatus = AccessPointStatus.valueOf((String)json.get("status"));
                ap.setStatus(newStatus);

                if (!newStatus.equals(oldStatus)) {
                    String message = "Access point status changed to " + newStatus.name();
                    if (newStatus.equals(AccessPointStatus.OFFLINE)) {
                        logger.warn(message, LogEntityType.ACCESS_POINT, ap.getName(), getClass());
                    } else {
                        logger.info(message, LogEntityType.ACCESS_POINT, ap.getName(), getClass());
                    }
                }
            } catch (IllegalArgumentException e){
                throw new BadRequestException("Invalid status given");
            }
        }
        return ResponseEntity.ok(apService.saveAP(ap));
    }

    /**
     * DELETE route to delete a access point by its id, only allowed by ADMIN
     * @param name
     * @return the deleted ap
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping(value = AP_NAME_PATH)
    public ResponseEntity<AccessPoint> deleteAPById(@PathVariable(value = "name") String name) {
        AccessPoint ap = apService.loadAPByName(name);
        // return a 404 error if the access point to be deleted does not exist
        if (ap == null) {
            throw new NotFoundInDatabaseException(AP, name);
        }
        apService.deleteAP(ap);

        logger.info("Access point deleted", LogEntityType.ACCESS_POINT, ap.getName(), getClass());

        return ResponseEntity.ok(ap);
    }

}
