package at.qe.skeleton.controllers.api;

import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SensorStationRestController implements BaseRestController{

    @Autowired
    private SensorStationService ssService;

    @Autowired
    private UserService userService;

    /**
     * Route to GET all sensor-stations, available for all users
     * @return List of all sensor-stations
     */
    @GetMapping(value ="/sensor-stations")
    public ResponseEntity<Object> getAllSensorStations() {
        return ResponseEntity.ok(ssService.getAllSS());
    }



}
