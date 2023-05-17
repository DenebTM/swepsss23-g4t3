package at.qe.skeleton.controllers.api;

import at.qe.skeleton.configs.jwtutils.JwtManager;
import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.PostAccessPointResponse;
import at.qe.skeleton.models.enums.AccessPointStatus;
import at.qe.skeleton.services.AccessPointService;
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
        return ResponseEntity.ok(ap);
    }

    /**
     * POST route to create a new Access Point
     * @param json body
     * @return newly created ap
     */
    @PostMapping(value = AP_PATH)
    public ResponseEntity<PostAccessPointResponse> createAP(@RequestBody Map<String, Object> json) {
        String name = (String)json.get("name");
        if (name == null || name.equals("")) {
            throw new BadRequestException("No name given");
        }

        String serverAddress = (String)json.get("serverAddress");
        if (serverAddress == null || serverAddress.equals("")) {
            throw new BadRequestException("No server address given");
        }

        String authToken = null;
        AccessPoint ap = apService.loadAPByName(name);
        if (ap != null) {
            if (ap.getStatus() != AccessPointStatus.UNCONFIRMED) {
                authToken = tokenManager.generateJwtToken("admin");
            }
            PostAccessPointResponse papp = new PostAccessPointResponse(ap, authToken);
            return ResponseEntity.ok(papp);
        } else {
            ap = apService.saveAP(new AccessPoint(
                name,
                serverAddress,
                AccessPointStatus.UNCONFIRMED
            ));
            PostAccessPointResponse papp = new PostAccessPointResponse(ap, authToken);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(papp);
        }
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
                ap.setStatus(AccessPointStatus.valueOf((String)json.get("status")));
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
        return ResponseEntity.ok(ap);
    }

}
