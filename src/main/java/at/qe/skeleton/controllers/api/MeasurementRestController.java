package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.models.*;
import at.qe.skeleton.services.LoggingService;
import at.qe.skeleton.services.MeasurementService;
import at.qe.skeleton.services.SensorStationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DateTimeException;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
public class MeasurementRestController implements BaseRestController {

    private static final String MEASUREMENTS_PATH = "/measurements";

    @Autowired
    private SensorStationService ssService;

    @Autowired
    private MeasurementService measurementService;

    @Autowired
    private LoggingService logger;

    // JSON keys used by PUT route
    public static final String JSON_KEY_TIMESTAMP = "timestamp";

    /**
     * Route to GET current or historic sensor station measurement values
     * @param id
     * @param json
     * @return List of historic measurements for given time frame or current/recent measurement
     */
    @GetMapping(value = SensorStationRestController.SS_ID_PATH + MEASUREMENTS_PATH)
    public ResponseEntity<List<Measurement>> getMeasurementsBySS(
        @PathVariable(value = "id")
            Integer id,
        @RequestParam(value = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Instant from,
        @RequestParam(value = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Instant to
    ) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SensorStationRestController.SS, id);
        }

        // return measurements up to latest available by default
        if (to == null) {
            Measurement lastMeasurement = measurementService.getCurrentMeasurement(id);
            if (lastMeasurement != null) {
                to = lastMeasurement.getTimestamp();
            } else {
                to = Instant.now(); // (no measurements will be returned if this is reached)
            }
        }

        // return one week of measurements by default
        if (from == null) {
            from = to.minusSeconds(7 * 24 * 60 * 60L);
        }

        // return 400 error if "from"-date is after "to"-date
        if (from.isAfter(to)) {
            throw new BadRequestException("End date must not be before start date");
        }

        return ResponseEntity.ok(measurementService.getMeasurements(id, from, to));
    }

    /**
     * Route to Get a list of all current measurements
     * @return An object containing the returned measurements indexed by sensor station
     */
    @GetMapping(value = MEASUREMENTS_PATH)
    public ResponseEntity<Map<Integer, Measurement>> getAllCurrentMeasurements() {
        return ResponseEntity.ok(measurementService.getAllCurrentMeasurements());
    }

    /**
     * Route to create a new measurement, for AP to send new measurement data
     * @param id
     * @param json
     * @return the newly created measurement object
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value = SensorStationRestController.SS_ID_PATH + MEASUREMENTS_PATH)
    public ResponseEntity<Measurement> sendMeasurement(@PathVariable(value = "id") Integer id, @RequestBody Map<String, Object> json) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SensorStationRestController.SS, id);
        }

        Instant timestamp = Instant.now();
        if (json.containsKey(JSON_KEY_TIMESTAMP)) {
            try {
                timestamp = Instant.parse(String.valueOf(json.get(JSON_KEY_TIMESTAMP)));
            } catch (DateTimeException e) {
                throw new BadRequestException("Invalid timestamp");
            }
            json.remove(JSON_KEY_TIMESTAMP);
        }

        Measurement newMeasurement = new Measurement();
        newMeasurement.setSensorStation(ss);
        newMeasurement.setTimestamp(timestamp);

        var mapper = new ObjectMapper();
        try {
            SensorValues newValues = mapper.convertValue(json, SensorValues.class);
            newMeasurement.setData(newValues);
        } catch (IllegalArgumentException e) {
            logger.warn("Rejected invalid measurements: " + e.getMessage(), LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
            throw new BadRequestException("Invalid sensor values");
        }

        try {
            newMeasurement = measurementService.saveMeasurement(newMeasurement);
            logger.info("New measurements received", LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
            return ResponseEntity.ok(newMeasurement);
        } catch (Exception e) {
            logger.warn("Unknown error receiving measurements: " + e.getMessage(), LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
            throw new BadRequestException(e.getMessage());
        }
    }

}
