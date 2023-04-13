package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.services.SensorStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SensorStationRestController implements BaseRestController {

    private static final String SS_PATH = "/sensor-stations";
    @Autowired
    private SensorStationService ssService;

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
    @GetMapping(value = SS_PATH +"/{uuid}")
    public ResponseEntity<Object> getSSById(@PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);

        // Return a 404 error if the sensor-station is not found
        if (ss == null) {
            return HelperFunctions.notFoundError("Sensor station", String.valueOf(id));
        }

        return ResponseEntity.ok(ss);
    }

}
