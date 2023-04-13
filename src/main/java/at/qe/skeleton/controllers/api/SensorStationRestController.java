package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.services.SensorStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class SensorStationRestController implements BaseRestController {

    @Autowired
    private SensorStationService ssService;

    private static final String SS_PATH = "/sensor-stations";
    private static final String SS_ID_PATH = SS_PATH + "/{uuid}";
    private static final String SS_ID_GARDENER_PATH = SS_ID_PATH + "/gardeners";

    /**
     * Route to GET all sensor stations, available for all users
     * @return List of all sensor stations
     */
    @GetMapping(value = SS_PATH)
    public ResponseEntity<Object> getAllSensorStations() {
        return ResponseEntity.ok(ssService.getAllSS());
    }

    /**
     * Route to GET a specific sensor-station by its ID
     * @param id
     * @return sensor station
     */
    @GetMapping(value = SS_ID_PATH)
    public ResponseEntity<Object> getSSById(@PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);

        // Return a 404 error if the sensor-station is not found
        if (ss == null) {
            return HelperFunctions.notFoundError("Sensor station", String.valueOf(id));
        }

        return ResponseEntity.ok(ss);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = SS_ID_GARDENER_PATH)
    public ResponseEntity<Object> getGardenersBySS(@PathVariable(value = "uuid") Integer id){
        //TODO return a List of Strings containing all usernames that are assigned
        return ResponseEntity.ok("");
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value = SS_ID_GARDENER_PATH + "/{username}")
    public ResponseEntity<Object> assignGardenerToSS(@PathVariable(value = "uuid") Integer id, @PathVariable(value = "username") String username){
        //TODO assign Gardener to SS
        return ResponseEntity.ok("The gardener was successfully assigned");
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping(value = SS_ID_GARDENER_PATH + "/{username}")
    public ResponseEntity<Object> removeGardenerFromSS(@PathVariable(value = "uuid") Integer id, @PathVariable(value = "username") String username){
        //TODO delete Gardener from SS, and SS from Gardeners SS List
        return ResponseEntity.ok("The gardener was removed.");
    }

}
