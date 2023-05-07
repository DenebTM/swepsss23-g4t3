package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.services.MeasurementService;
import at.qe.skeleton.services.SensorStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@RestController
public class MeasurementRestController implements BaseRestController{

    @Autowired
    MeasurementService measurementService;
    @Autowired
    SensorStationService sensorStationService;

    private static final String M_PATH = "/measurements";

    /**
     * Route to GET the latest Measurement for each available sensor station
     * @return List of measurements
     */
    @GetMapping(M_PATH)
    public ResponseEntity<Object> getAllLatestMeasurements() {
        List<Measurement> measurements = new ArrayList<>();
        Collection<SensorStation> sensorStations = sensorStationService.getAllSS();
        for (SensorStation ss :
                sensorStations) {
            measurements.add(measurementService.getLatestMeasurementBySensorStation(ss));
        }
        return ResponseEntity.ok(measurements);
    }

    /**
     * Route to GET measurements ordered by timestamp for a specific sensor station (if that sensor station is found),
     * filterable by start and end date.
     * @param id sensor station id
     * @param startDate starting timestamp of measurements
     * @param endDate ending timestamp of measurements
     * @return List of measurements of a specific interval (if requested) for given sensor station
     */
    @GetMapping(M_PATH + "/{ssid}")
    public ResponseEntity<Object> getMeasurementsBySSOrderedByTimestamp(@PathVariable(value = "ssid") Integer id, @RequestParam LocalDateTime startDate, @RequestParam LocalDateTime endDate) {
        SensorStation ss = sensorStationService.loadSSById(id);
        if (ss == null) {
            return HelperFunctions.notFoundError("Sensor Station", String.valueOf(id));
        }
        return ResponseEntity.ok(measurementService.getTimestampOrderedMeasurementsByInterval(
                ss,
                Objects.requireNonNullElse(startDate, LocalDateTime.MIN),
                Objects.requireNonNullElse(endDate, LocalDateTime.MAX)
        ));
    }
}
