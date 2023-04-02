package at.qe.skeleton.controllers.api;

import at.qe.skeleton.model.SensorStation;
import at.qe.skeleton.services.SensorStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SensorStationRestController implements BaseRestController{

    @Autowired
    private SensorStationService ssService;

    /**
     * Route to GET all sensor-stations, available for all users
     * @return List of all sensor-stations
     */
    @GetMapping(value ="/sensor-stations")
    public ResponseEntity<Object> getAllSensorStations() {
        return ResponseEntity.ok(ssService.getAllSS());
    }

    /**
     * Route to GET a specific sensor-station by its ID
     * @param id
     * @return sensor-station
     */
    @GetMapping(value="/sensor-stations/{uuid}")
    public ResponseEntity<Object> getSSById(@PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);

        // Return a 404 error if the sensor-station is not found
        if (ss == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sensor-station with id: \"" + id + "\" not found.");
        }

        return ResponseEntity.status(HttpStatus.OK).body(ss);
    }

}
