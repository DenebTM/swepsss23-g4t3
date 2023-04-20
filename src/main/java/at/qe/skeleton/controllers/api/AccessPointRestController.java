package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.services.AccessPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AccessPointRestController implements BaseRestController {

    @Autowired
    private AccessPointService apService;

    private static final String AP_PATH = "/access-points";
    private static final String AP_ID_PATH = AP_PATH + "/{id}";


    /**
     * Route to GET all access points, available for all users
     * @return List of all access points
     */
    @GetMapping(value = AP_PATH)
    public ResponseEntity<Object> getAllAccessPoints() {
        return ResponseEntity.ok(apService.getAllAP());
    }

    /**
     * Route to GET a specific access point by its ID
     * @param id
     * @return access point
     */
    @GetMapping(value = AP_ID_PATH)
    public ResponseEntity<Object> getAPById(@PathVariable(value = "id") Integer id) {
        AccessPoint ap = apService.loadAPById(id);
        // Return a 404 error if the access point is not found
        if (ap == null) {
            return HelperFunctions.notFoundError("Access point", String.valueOf(id));
        }
        return ResponseEntity.ok(ap);
    }

    /**
     * a PUT route to update an existing access point
     * @param id
     * @param json
     * @return updated access point
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping(value = AP_ID_PATH)
    public ResponseEntity<Object> updateAP(@PathVariable(value = "id") Integer id,  @RequestBody Map<String, Object> json) {
        AccessPoint ap = apService.loadAPById(id);
        // return a 404 error if the access point to be updated does not exist
        if (ap == null) {
            return HelperFunctions.notFoundError("Access point", String.valueOf(id));
        }
        if (json.containsKey("name")) {
            ap.setName((String)json.get("name"));
        }
        if (json.containsKey("active")) {
            ap.setActive((Boolean)json.get("active"));
        }
        return ResponseEntity.ok(apService.saveAP(ap));
    }


        /**
         * DELETE route to delete a access point by its id, only allowed by ADMIN
         * @param id
         * @return the deleted ap
         */
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping(value = AP_ID_PATH)
    public ResponseEntity<Object> deleteAPById(@PathVariable(value = "id") Integer id) {
        AccessPoint ap = apService.loadAPById(id);
        // return a 404 error if the access point to be deleted does not exist
        if (ap == null) {
            return HelperFunctions.notFoundError("Access point", String.valueOf(id));
        }
        apService.deleteAP(ap);
        return ResponseEntity.ok(ap);
    }

}
