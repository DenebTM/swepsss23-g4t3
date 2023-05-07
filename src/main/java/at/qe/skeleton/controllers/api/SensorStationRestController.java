package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.models.enums.Status;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.MeasurementService;
import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private MeasurementService measurementService;
    @Autowired
    private PhotoDataRepository photoDataRepository;
    @Autowired
    private UserService userService;

    private static final String SS_PATH = "/sensor-stations";
    private static final String SS_ID_PATH = SS_PATH + "/{uuid}";
    private static final String SS_ID_GARDENER_PATH = SS_ID_PATH + "/gardeners";
    private static final String SS_ID_PHOTOS_PATH = SS_ID_PATH + "/photos";

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

    /**
     * a PUT route to update an existing sensor station
     * @param id
     * @param json
     * @return updated sensor station
     */
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GARDENER')")
    @PutMapping(value = SS_ID_PATH)
    public ResponseEntity<Object> updateSS(@PathVariable(value = "uuid") Integer id,  @RequestBody Map<String, Object> json) {
        SensorStation ss = ssService.loadSSById(id);
        // return a 404 error if the sensor station to be updated does not exist
        if (ss == null) {
            return HelperFunctions.notFoundError("Sensor station", String.valueOf(id));
        }
        if (json.containsKey("status")) {
            try {
                ss.setStatus(Status.valueOf((String) json.get("status")));
            } catch (IllegalArgumentException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Status does not exist.");
            }
        }
        if (json.containsKey("aggregationPeriod")) {
            try {
                ss.setAggregationPeriod(Long.valueOf((String)json.get("aggregationPeriod")));
            } catch (IllegalArgumentException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid number to update aggregation period.");
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
    public ResponseEntity<Object> deleteSSById(@PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        // return a 404 error if the sensor station to be deleted does not exist
        if (ss == null) {
            return HelperFunctions.notFoundError("Sensor station", String.valueOf(id));
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
    public ResponseEntity<Object> getGardenersBySS(@PathVariable(value = "uuid") Integer id){
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            return HelperFunctions.notFoundError("Sensor station", String.valueOf(id));
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
    public ResponseEntity<Object> assignGardenerToSS(@PathVariable(value = "uuid") Integer id, @PathVariable(value = "username") String username){
        SensorStation ss = ssService.loadSSById(id);
        Userx user = userService.loadUserByUsername(username);
        if (ss == null) {
            return HelperFunctions.notFoundError("Sensor station", String.valueOf(id));
        }
        if (user == null) {
            return HelperFunctions.notFoundError("User", String.valueOf(username));
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
    public ResponseEntity<Object> removeGardenerFromSS(@PathVariable(value = "uuid") Integer id, @PathVariable(value = "username") String username){
        SensorStation ss = ssService.loadSSById(id);
        Userx user = userService.loadUserByUsername(username);
        if (ss == null) {
            return HelperFunctions.notFoundError("Sensor station", String.valueOf(id));
        }
        if (user == null) {
            return HelperFunctions.notFoundError("User", String.valueOf(username));
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
    ResponseEntity<Object> deletePhoto(@PathVariable Integer photoId, @PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss != null) {
            List<String> gardeners = ssService.getGardenersBySS(ss);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentPrincipalName = authentication.getName();
            if (!gardeners.contains(currentPrincipalName) && authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ADMIN"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Gardener is not assigned to Sensor Station.");
            }
            Optional<PhotoData> maybePhoto = photoDataRepository.findByIdAndSensorStation(photoId, ss);
            if (maybePhoto.isPresent()) {
                photoDataRepository.delete(maybePhoto.get());
                return ResponseEntity.ok("Photo deleted");
            }
            return HelperFunctions.notFoundError("Photo", String.valueOf(photoId));
        }
        return HelperFunctions.notFoundError("Sensor Station", String.valueOf(id));
    }

    /**
     * a route to GET current or historic sensor station measurement values
     * @param id
     * @param json
     * @return List of historic measurements for given time frame or current/recent measurement
     */
    @GetMapping(value = SS_ID_PATH + "/measurements")
    public ResponseEntity<Object> getMeasurementsBySS(@PathVariable(value = "uuid") Integer id, @RequestBody Map<String, Object> json){
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid start date");
        }
        // return 400 error if "from"-date isn't iso formatted
        if (json.containsKey("from")) {
            try {
                from = (Instant) json.get("from");
            } catch (DateTimeException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid start date");
            }
        }
        // return 400 error if "to"-date isn't iso formatted
        if (json.containsKey("to")) {
            try {
                to = (Instant) json.get("to");
            } catch (DateTimeException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid end date");
            }
        }
        // return 400 error if "from"-date is after "to"-date
        if (from.isAfter(to)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("End date should be later than start date");
        }
        return ResponseEntity.ok(measurementService.getMeasurements(id, from, to));
    }

    /**
     * a route to Get a list of all current measurements
     * @return An object containing the returned measurements indexed by sensor station
     */
    @GetMapping(value = "/measurements")
    public ResponseEntity<Object> getAllCurrentMeasurements(){
        return ResponseEntity.ok(measurementService.getAllCurrentMeasurements());
    }

}
