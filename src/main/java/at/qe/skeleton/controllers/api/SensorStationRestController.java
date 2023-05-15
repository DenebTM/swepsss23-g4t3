package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.models.enums.SensorStationStatus;
import at.qe.skeleton.models.*;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.MeasurementService;
import at.qe.skeleton.services.AccessPointService;
import at.qe.skeleton.repositories.SensorValuesRepository;
import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserxService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.DateTimeException;
import java.time.Instant;
import java.util.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class SensorStationRestController implements BaseRestController {

    @Autowired
    private SensorStationService ssService;

    @Autowired
    private AccessPointService apService;

    @Autowired
    private MeasurementService measurementService;
    @Autowired
    private PhotoDataRepository photoDataRepository;

    @Autowired
    private UserxService userService;

    @Autowired
    private SensorValuesRepository sensorValuesRepository;

    private static final String SS = "Sensor station";
    private static final String SS_PATH = "/sensor-stations";
    private static final String SS_AP_PATH = AccessPointRestController.AP_NAME_PATH + SS_PATH;
    private static final String SS_ID_PATH = SS_PATH + "/{uuid}";
    private static final String SS_ID_GARDENER_PATH = SS_ID_PATH + "/gardeners";
    private static final String SS_ID_PHOTOS_PATH = SS_ID_PATH + "/photos";
    private static final String MEASUREMENTS_PATH = "/measurements";

    /**
     * Route to GET all sensor stations, available for all users
     * @return List of all sensor stations
     */
    @GetMapping(value = SS_PATH)
    public ResponseEntity<Collection<SensorStation>> getAllSensorStations() {
        return ResponseEntity.ok(ssService.getAllSS());
    }

    /**
     * Route to GET all sensor stations for a specified access point
     *
     * @return List of all sensor stations
     */
    @GetMapping(value = SS_AP_PATH)
    public ResponseEntity<Collection<SensorStation>> getSSForAccessPoint(@PathVariable(value = "name") String apName) {
        // Return a 404 error if the access point is not found
        AccessPoint ap = apService.loadAPByName(apName);
        if (ap == null) {
            throw new NotFoundInDatabaseException("Access point", apName);
        }

        return ResponseEntity.ok(ssService.getSSForAccessPoint(apName));
    }

    /**
     * Route to GET a specific sensor-station by its ID
     * @param id
     * @return sensor station
     */
    @GetMapping(value = SS_ID_PATH)
    public ResponseEntity<SensorStation> getSSById(@PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);

        // Return a 404 error if the sensor-station is not found
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }

        return ResponseEntity.ok(ss);
    }

    /**
     * Route to add a list of sensor stations to the db
     *
     * This is used by the access point to report found sensor stations
     * while it is in SEARCHING Mode
     *
     * @param newSSList list of new sensor stations
     * @return the new sensor stations as added to the database
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value = SS_AP_PATH)
    public ResponseEntity<Collection<SensorStation>> addSS(
        @PathVariable(value = "name") String apName,
        @RequestBody Collection<SensorStation> newSSList
    ) {
        // Return a 404 error if the access point is not found
        AccessPoint ap = apService.loadAPByName(apName);
        if (ap == null) {
            throw new NotFoundInDatabaseException("Access point", String.valueOf(apName));
        }

        List<SensorStation> retSSList = new ArrayList<>();
        for (SensorStation newSS : newSSList) {
            newSS.setAccessPoint(ap);
            retSSList.add(ssService.saveSS(newSS));
        }
        return ResponseEntity.ok(retSSList);
    }

    /**
     * a PUT route to update an existing sensor station
     * @param id
     * @param json
     * @return updated sensor station
     */
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GARDENER')")
    @PutMapping(value = SS_ID_PATH)
    public ResponseEntity<SensorStation> updateSS(@PathVariable(value = "uuid") Integer id,  @RequestBody Map<String, Object> json) {
        SensorStation ss = ssService.loadSSById(id);
        // return a 404 error if the sensor station to be updated does not exist
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }
        if (json.containsKey("status")) {
            try {
                ss.setStatus(SensorStationStatus.valueOf((String) json.get("status")));
            } catch (IllegalArgumentException e){
                throw new BadRequestException("Invalid status");
            }
        }
        if (json.containsKey("aggregationPeriod")) {
            try {
                Long aggregationPeriod = Long.valueOf((Integer)json.get("aggregationPeriod"));
                if (aggregationPeriod<=0){ throw new BadRequestException("Invalid aggregation period");}
                ss.setAggregationPeriod(aggregationPeriod);
            } catch (IllegalArgumentException e){
                throw new BadRequestException("Invalid aggregation period");
            }
        }
        return ResponseEntity.ok(ssService.saveSS(ss));
    }

    /**
     * DELETE route to delete a sensor station by its id, only allowed by ADMIN
     * @param id
     * @return the deleted sensor station
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping(value = SS_ID_PATH)
    public ResponseEntity<SensorStation> deleteSSById(@PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        // return a 404 error if the sensor station to be deleted does not exist
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }
        ssService.deleteSS(ss);
        return ResponseEntity.ok(ss);
    }

    /**
     * Route to GET all gardeners assigned to a single sensor station
     * @param id
     * @return list of usernames
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = SS_ID_GARDENER_PATH)
    public ResponseEntity<Collection<String>> getGardenersBySS(@PathVariable(value = "uuid") Integer id){
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }
        List<String> usernames = ssService.getGardenersBySS(ss);
        return ResponseEntity.ok(usernames);
    }

    /**
     * a POST route to assign gardeners to a specific sensor station
     * @param id
     * @param username
     * @return the updated sensor station
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value = SS_ID_GARDENER_PATH + "/{username}")
    public ResponseEntity<SensorStation> assignGardenerToSS(@PathVariable(value = "uuid") Integer id, @PathVariable(value = "username") String username){
        SensorStation ss = ssService.loadSSById(id);
        Userx user = userService.loadUserByUsername(username);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }
        if (user == null) {
            throw new NotFoundInDatabaseException("User", username);
        }
        ss.getGardeners().add(user);
        return ResponseEntity.ok(ssService.saveSS(ss));
    }

    /**
     * a DELETE route to remove an assigned gardener from its sensor station
     * @param id
     * @param username
     * @return the updated sensor station
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping(value = SS_ID_GARDENER_PATH + "/{username}")
    public ResponseEntity<SensorStation> removeGardenerFromSS(@PathVariable(value = "uuid") Integer id, @PathVariable(value = "username") String username){
        SensorStation ss = ssService.loadSSById(id);
        Userx user = userService.loadUserByUsername(username);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }
        if (user == null) {
            throw new NotFoundInDatabaseException("User", username);
        }
        ss.getGardeners().remove(user);
        ssService.saveSS(ss);
        return ResponseEntity.ok(ssService.saveSS(ss));
    }

    /**
     * Route to DELete pictures from the gallery
     * @param photoId
     * @return the picture if found
     */
    @DeleteMapping(value = SS_ID_PHOTOS_PATH + "/{photoId}")
    ResponseEntity<String> deletePhoto(@PathVariable Integer photoId, @PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss != null) {
            List<String> gardeners = ssService.getGardenersBySS(ss);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentPrincipalName = authentication.getName();
            if (!gardeners.contains(currentPrincipalName) && authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ADMIN"))) {
                throw new AccessDeniedException("Gardener is not assigned to Sensor Station.");
            }
            Optional<PhotoData> maybePhoto = photoDataRepository.findByIdAndSensorStation(photoId, ss);
            if (maybePhoto.isPresent()) {
                photoDataRepository.delete(maybePhoto.get());
                return ResponseEntity.ok("Photo deleted");
            }

            throw new NotFoundInDatabaseException("Photo", id);
        }
        throw new NotFoundInDatabaseException(SS, id);
    }

    /**
     * a route to GET current or historic sensor station measurement values
     * @param id
     * @param json
     * @return List of historic measurements for given time frame or current/recent measurement
     */
    @GetMapping(value = SS_ID_PATH + MEASUREMENTS_PATH)
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
     * a route to Get a list of all current measurements
     * @return An object containing the returned measurements indexed by sensor station
     */
    @GetMapping(value = MEASUREMENTS_PATH)
    public ResponseEntity<List<Measurement>> getAllCurrentMeasurements(){
        return ResponseEntity.ok(measurementService.getAllCurrentMeasurements());
    }

    /**
     * a POST route to create a new measurement, for AP to send new measurement data
     * @param id
     * @param json
     * @return the newly created measurement object
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value = SS_ID_PATH + MEASUREMENTS_PATH)
    public ResponseEntity<Object> sendMeasurementsBySS(@PathVariable(value = "uuid") Integer id, @RequestBody Map<String, Object> json) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
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
