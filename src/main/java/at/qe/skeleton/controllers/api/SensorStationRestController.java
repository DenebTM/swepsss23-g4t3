package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.models.ImageData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.models.enums.Status;
import at.qe.skeleton.repositories.ImageDataRepository;
import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DateTimeException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
public class SensorStationRestController implements BaseRestController {

    @Autowired
    private SensorStationService ssService;
    @Autowired
    private ImageDataRepository imageDataRepository;
    @Autowired
    private UserService userService;

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

    /**
     * a PUT route to update an existing sensor station
     * @param id
     * @param json
     * @return updated sensor station
     */
    // TODO: for now authority is ADMIN, but for example aggregationPeriod should be changeable also by GARDENERS
    //  and I guess status should only be set automatically instead of manually by admin
    @PreAuthorize("hasAuthority('ADMIN')")
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
     * Route to GET all photos from a specific sensor-station by its ID
     * @param id
     * @return list of photos
     */

    @GetMapping(value = SS_PATH + "/{uuid}/photos")
    public ResponseEntity<Object> getAllPhotosBySS(@PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss != null) {
            List<ImageData> images = imageDataRepository.findAllBySensorStation(ss);
            return ResponseEntity.ok(images);
        }
        return HelperFunctions.notFoundError("Sensor Station", String.valueOf(id));
    }

    @GetMapping(value = SS_ID_PATH + "/measurements")
    public ResponseEntity<Object> getMeasurements(@PathVariable(value = "uuid") Integer id, @RequestBody Map<String, Object> json){
        LocalDateTime from = null;
        LocalDateTime to = null;
        if (json.containsKey("from")) {
            try {
                from = LocalDateTime.from(Instant.parse((String)json.get("from")));
            } catch (DateTimeException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid start date");
            }
        }
        if (json.containsKey("to")) {
            try {
                to = LocalDateTime.from(Instant.parse((String)json.get("to")));
            } catch (DateTimeException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid end date");
            }
        }
        return ResponseEntity.ok(ssService.getMeasurements(from, to));
    }

}
