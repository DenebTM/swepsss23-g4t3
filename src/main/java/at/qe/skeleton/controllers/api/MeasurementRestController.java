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
    public ResponseEntity<List<Measurement>> getMeasurementsBySS(@PathVariable(value = "uuid") Integer id, @RequestBody Map<String, Object> json){
        Instant from = Instant.now();       // if "from"-date is present in json body, it will be changed to that date
        Instant to = Instant.now();         // if "to"-date is present in json body, it will be changed to that date

        // if keys "from" and "to" are missing in json body return the most recent/current measurement
        if (!json.containsKey("from") && !json.containsKey("to")){
            Measurement currentMeasurement = measurementService.getCurrentMeasurement(id);
            if (currentMeasurement == null){
                return ResponseEntity.ok(new ArrayList<>());
            } else {
                return ResponseEntity.ok(new ArrayList<>(Arrays.asList(currentMeasurement)));
            }
        }
        // return a 400 error if there is a "to"-date but no "from"-date given in json body
        if (!json.containsKey("from") && json.containsKey("to")){
            throw new BadRequestException("Start or end date missing");
        }
        // return 400 error if "from"-date isn't iso formatted
        if (json.containsKey("from")) {
            try {
                from = Instant.parse((String)json.get("from"));
            } catch (DateTimeException e){
                throw new BadRequestException("Invalid start date");
            }
        }
        // return 400 error if "to"-date isn't iso formatted
        if (json.containsKey("to")) {
            try {
                to = Instant.parse((String)json.get("to"));
            } catch (DateTimeException e){
                throw new BadRequestException("Invalid end date");
            }
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
    public ResponseEntity<Object> sendMeasurementsBySS(@PathVariable(value = "uuid") Integer id, @RequestBody Map<String, Object> json) {
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
