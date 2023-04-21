package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SensorStationRestController implements BaseRestController {

    @Autowired
    private SensorStationService ssService;
    @Autowired
    private PhotoDataRepository photoDataRepository;
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
    @PreAuthorize("hasAnyRole('ADMIN', 'GARDENER', 'USER')")
    @GetMapping(value = SS_ID_PATH + "/photos")
    public ResponseEntity<Object> getAllPhotosBySS(@PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss != null) {
            List<PhotoData> photos = photoDataRepository.findAllBySensorStation(ss);
            return ResponseEntity.ok(photos);
        }
        return HelperFunctions.notFoundError("Sensor Station", String.valueOf(id));
    }

}
