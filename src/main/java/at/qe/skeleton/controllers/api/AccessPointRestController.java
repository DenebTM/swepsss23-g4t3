package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.model.AccessPoint;
import at.qe.skeleton.services.AccessPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccessPointRestController implements BaseRestController {

    @Autowired
    private AccessPointService apService;
    @Autowired
    private HelperFunctions helperFunctions;

    private static final String AP_PATH = "/access-points";

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
    @GetMapping(value = AP_PATH +"/{id}")
    public ResponseEntity<Object> getAPById(@PathVariable(value = "id") Integer id) {
        AccessPoint ap = apService.loadAPById(id);

        // Return a 404 error if the access point is not found
        if (ap == null) {
            return helperFunctions.notFoundError("Access point", String.valueOf(id));
        }

        return ResponseEntity.ok(ap);
    }
}
