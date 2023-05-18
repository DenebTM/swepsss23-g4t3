package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.*;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.models.enums.SensorStationStatus;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.AccessPointService;
import at.qe.skeleton.services.LoggingService;
import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class SensorStationRestController implements BaseRestController {

    @Autowired
    private SensorStationService ssService;

    @Autowired
    private AccessPointService apService;

    @Autowired
    private PhotoDataRepository photoDataRepository;

    @Autowired
    private UserxService userService;

    @Autowired
    private LoggingService logger;

    public static final String SS = "Sensor station";
    private static final String SS_PATH = "/sensor-stations";
    private static final String SS_AP_PATH = AccessPointRestController.AP_NAME_PATH + SS_PATH;
    public static final String SS_ID_PATH = SS_PATH + "/{id}";
    private static final String SS_ID_GARDENER_PATH = SS_ID_PATH + "/gardeners";
    private static final String SS_ID_PHOTOS_PATH = SS_ID_PATH + "/photos";

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
    public ResponseEntity<SensorStation> getSSById(@PathVariable(value = "id") Integer id) {
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
            SensorStation existingSS = ssService.loadSSById(newSS.getSsID());

            if (existingSS == null) {
                newSS.setAccessPoint(ap);
                retSSList.add(ssService.saveSS(newSS));

                logger.info("Registered available sensor station " + newSS.getSsID(), LogEntityType.ACCESS_POINT, ap.getName(), getClass());
            }
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
    public ResponseEntity<SensorStation> updateSS(@PathVariable(value = "id") Integer id,  @RequestBody Map<String, Object> json) {
        SensorStation ss = ssService.loadSSById(id);
        // return a 404 error if the sensor station to be updated does not exist
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }
        if (json.containsKey("status")) {
            try {
                SensorStationStatus oldStatus = ss.getStatus();
                SensorStationStatus newStatus = SensorStationStatus.valueOf((String)json.get("status"));
                ss.setStatus(newStatus);

                if (!newStatus.equals(oldStatus)) {
                    String message = "Access point status changed to " + newStatus.name();
                    if (Arrays.asList(SensorStationStatus.OFFLINE, SensorStationStatus.PAIRING_FAILED).contains(newStatus)) {
                        logger.warn(message, LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
                    } else {
                        logger.info(message, LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
                    }
                }
                ss.setStatus(SensorStationStatus.valueOf((String)json.get("status")));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status");
            }
        }
        if (json.containsKey("aggregationPeriod")) {
            try {
                Long oldAggregationPeriod = ss.getAggregationPeriod();
                Long newAggregationPeriod = Long.valueOf((Integer)json.get("aggregationPeriod"));
                if (newAggregationPeriod <= 0) {
                    throw new BadRequestException("Invalid aggregation period");
                }

                if (!newAggregationPeriod.equals(oldAggregationPeriod)) {
                    logger.info("Changed aggregation period", LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
                }

                ss.setAggregationPeriod(newAggregationPeriod);
            } catch (IllegalArgumentException e) {
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
    public ResponseEntity<SensorStation> deleteSSById(@PathVariable(value = "id") Integer id) {
        String authenticatedUser = SecurityContextHolder.getContext().getAuthentication().getName();
        
        SensorStation ss = ssService.loadSSById(id);
        // return a 404 error if the sensor station to be deleted does not exist
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }
        ssService.deleteSS(ss);

        // null related collections to prevent 500 error
        ss.setGardeners(null);
        ss.setMeasurements(null);

        logger.info("Sensor station deleted by " + authenticatedUser, LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());

        return ResponseEntity.ok(ss);
    }

    /**
     * Route to GET all gardeners assigned to a single sensor station
     * @param id
     * @return list of usernames
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = SS_ID_GARDENER_PATH)
    public ResponseEntity<Collection<String>> getGardenersBySS(@PathVariable(value = "id") Integer id){
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
    public ResponseEntity<SensorStation> assignGardenerToSS(@PathVariable(value = "id") Integer id, @PathVariable(value = "username") String username){
        String authenticatedUser = SecurityContextHolder.getContext().getAuthentication().getName();
        
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }

        Userx user = userService.loadUserByUsername(username);
        if (user == null) {
            throw new NotFoundInDatabaseException("User", username);
        }

        if (!ss.getGardeners().contains(user)) {
            ss.getGardeners().add(user);

            logger.info(user.getUsername() + " assigned to sensor station by " + authenticatedUser,
                LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
        }

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
    public ResponseEntity<SensorStation> removeGardenerFromSS(@PathVariable(value = "id") Integer id, @PathVariable(value = "username") String username){
        String authenticatedUser = SecurityContextHolder.getContext().getAuthentication().getName();
        
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }

        Userx user = userService.loadUserByUsername(username);
        if (user == null) {
            throw new NotFoundInDatabaseException("User", username);
        }

        if (ss.getGardeners().contains(user)) {
            ss.getGardeners().remove(user);

            logger.info(user.getUsername() + " unassigned from sensor station by " + authenticatedUser,
                LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
        }

        return ResponseEntity.ok(ssService.saveSS(ss));
    }

    /**
     * Route to DELete pictures from the gallery
     * @param photoId
     * @return the picture if found
     */
    @DeleteMapping(value = SS_ID_PHOTOS_PATH + "/{photoId}")
    ResponseEntity<String> deletePhoto(@PathVariable Integer photoId, @PathVariable(value = "id") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }

        List<String> gardeners = ssService.getGardenersBySS(ss);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUser = SecurityContextHolder.getContext().getAuthentication().getName();
    
        if (!gardeners.contains(authenticatedUser) && authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ADMIN"))) {
            logger.info("Attempt to delete photo by unauthorized user " + authenticatedUser,
                LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
            throw new AccessDeniedException("Gardener is not assigned to sensor station");
        }

        Optional<PhotoData> maybePhoto = photoDataRepository.findByIdAndSensorStation(photoId, ss);
        if (!maybePhoto.isPresent()) {
            throw new NotFoundInDatabaseException("Photo", id);
        }

        photoDataRepository.delete(maybePhoto.get());

        logger.info("Photo deleted by " + authenticatedUser,
            LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());

        return ResponseEntity.ok("Photo deleted");
    }

}
