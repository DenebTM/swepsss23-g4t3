package at.qe.skeleton.controllers.api;

import at.qe.skeleton.model.AccessPoint;
import at.qe.skeleton.services.AccessPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccessPointRestController implements BaseRestController {

    @Autowired
    private AccessPointService apService;

    /**
     * Route to GET all access points, available for all users
     * @return List of all access points
     */
    @GetMapping(value ="/access points")
    public ResponseEntity<Object> getAllAccessPoints() {
        return ResponseEntity.status(HttpStatus.OK).body(apService.getAllAP());
    }

    /**
     * Route to GET a specific access point by its ID
     * @param id
     * @return access point
     */
    @GetMapping(value="/access-points/{id}")
    public ResponseEntity<Object> getAPById(@PathVariable(value = "id") Integer id) {
        AccessPoint ap = apService.loadAPById(id);

        // Return a 404 error if the access points is not found
        if (ap == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Access points with id: \"" + id + "\" not found.");
        }

        return ResponseEntity.status(HttpStatus.OK).body(ap);
    }
}
