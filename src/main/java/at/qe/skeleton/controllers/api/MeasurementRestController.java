package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.*;
import at.qe.skeleton.services.MeasurementService;
import at.qe.skeleton.repositories.SensorValuesRepository;
import at.qe.skeleton.services.SensorStationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DateTimeException;
import java.time.Instant;
import java.util.*;
import java.util.List;
import java.util.Map;

@RestController
public class MeasurementRestController implements BaseRestController {

    @Autowired
    private SensorStationService ssService;
    @Autowired
    private MeasurementService measurementService;
    @Autowired
    private SensorValuesRepository sensorValuesRepository;

    private static final String MEASUREMENTS_PATH = "/measurements";

    /**
     * Route to GET current or historic sensor station measurement values
     * @param id
     * @param json
     * @return List of historic measurements for given time frame or current/recent measurement
     */
    @GetMapping(value = SensorStationRestController.SS_ID_PATH + MEASUREMENTS_PATH)
    public ResponseEntity<List<Measurement>> getMeasurementsBySS(
        @PathVariable(value = "uuid")
            Integer id,
        @RequestParam(value = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Instant from,
        @RequestParam(value = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Instant to
    ) {
        // if keys "from" and "to" are missing in json body return the most recent/current measurement
        if (from == null && to == null) {
            Measurement currentMeasurement = measurementService.getCurrentMeasurement(id);
            return ResponseEntity.ok(Arrays.asList(currentMeasurement));
        }

        // return a 400 error if there is a "to"-date but no "from"-date given in json body
        if (from == null || to == null){
            throw new BadRequestException("Both start and end date must be specified");
        }
        // return 400 error if "from"-date is after "to"-date
        if (from.isAfter(to)){
            throw new BadRequestException("End date must not be before start date");
        }

        return ResponseEntity.ok(measurementService.getMeasurements(id, from, to));
    }

    /**
     * Route to Get a list of all current measurements
     * @return An object containing the returned measurements indexed by sensor station
     */
    @GetMapping(value = MEASUREMENTS_PATH)
    public ResponseEntity<List<Measurement>> getAllCurrentMeasurements(){
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
    public ResponseEntity<Measurement> sendMeasurement(@PathVariable(value = "uuid") Integer id, @RequestBody Map<String, Object> json) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SensorStationRestController.SS, id);
        }

        if (!json.containsKey("timestamp")){
            throw new BadRequestException("No timestamp");
        }

        Measurement newMeasurement = new Measurement();
        newMeasurement.setSensorStation(ss);
        try {
            newMeasurement.setTimestamp(Instant.parse((String)json.get("timestamp")));
        } catch (DateTimeException e){
            throw new BadRequestException("Invalid timestamp");
        }
        json.remove("timestamp");

        var mapper = new ObjectMapper();
        try {
            SensorValues newValues = mapper.convertValue(json, SensorValues.class);
            newMeasurement.setData(sensorValuesRepository.save(newValues));
        } catch (IllegalArgumentException e){
            throw new BadRequestException("Invalid sensor values");
        }

        return ResponseEntity.ok(measurementService.saveMeasurement(newMeasurement));
    }

}
