package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.*;
import at.qe.skeleton.models.enums.AccessPointStatus;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.models.enums.SensorStationStatus;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.repositories.SensorValuesRepository;
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

import com.fasterxml.jackson.databind.ObjectMapper;

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
    private SensorValuesRepository sensorValuesRepository;

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

    // JSON keys used by PUT route
    public static final String JSON_KEY_STATUS = "status";
    public static final String JSON_KEY_AGGPERIOD = "aggregationPeriod";
    public static final String JSON_KEY_LOWERBOUND = "lowerBound";
    public static final String JSON_KEY_UPPERBOUND = "upperBound";

    private static SensorValues partialValuesUpdate(SensorValues vals, Object json) {
        var mapper = new ObjectMapper();
        @SuppressWarnings({"unchecked"})
        SensorValues newVals = mapper.convertValue((Map<String, Object>)json, SensorValues.class);

        if (vals == null) {
            vals = new SensorValues();
        }

        if (newVals.getAirPressure() != null) {
            vals.setAirPressure(newVals.getAirPressure());
        }
        if (newVals.getAirQuality() != null) {
            vals.setAirQuality(newVals.getAirQuality());
        }
        if (newVals.getHumidity() != null) {
            vals.setHumidity(newVals.getHumidity());
        }
        if (newVals.getLightIntensity() != null) {
            vals.setLightIntensity(newVals.getLightIntensity());
        }
        if (newVals.getSoilMoisture() != null) {
            vals.setSoilMoisture(newVals.getSoilMoisture());
        }
        if (newVals.getTemperature() != null) {
            vals.setTemperature(newVals.getTemperature());
        }

        return vals;
    }

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
        // return a 404 error if the access point is not found
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

        // return a 404 error if the sensor-station is not found
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
        // return a 404 error if the access point is not found
        AccessPoint ap = apService.loadAPByName(apName);
        if (ap == null) {
            throw new NotFoundInDatabaseException("Access point", apName);
        }

        if (!AccessPointStatus.SEARCHING.equals(ap.getStatus())) {
            throw new BadRequestException("Access point " + apName + " is not in SEARCHING mode");
        }

        List<SensorStation> retSSList = new ArrayList<>();
        for (SensorStation newSS : newSSList) {
            SensorStation existingSS = ssService.loadSSById(newSS.getSsID());

            if (existingSS == null) {
                newSS.setAccessPoint(ap);
                retSSList.add(ssService.saveSS(newSS));

                logger.info("Sensor station " + newSS.getSsID() + " found by access point",
                    LogEntityType.ACCESS_POINT, ap.getName(), getClass());
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUser = authentication.getName();
        
        SensorStation ss = ssService.loadSSById(id);

        // return a 404 error if the sensor station to be updated does not exist
        if (ss == null) {
            throw new NotFoundInDatabaseException(SS, id);
        }

        List<String> gardeners = ssService.getGardenersBySS(ss);
        if (!gardeners.contains(authenticatedUser) && authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ADMIN"))) {
            logger.info("Attempt to update sensor station by unauthorized user " + authenticatedUser,
                LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
            throw new AccessDeniedException("Gardener is not assigned to sensor station");
        }

        if (json.containsKey(JSON_KEY_STATUS)) {
            try {
                SensorStationStatus oldStatus = ss.getStatus();
                SensorStationStatus newStatus = SensorStationStatus.valueOf(String.valueOf(json.get(JSON_KEY_STATUS)));

                if (!newStatus.equals(oldStatus)) {
                    ss.setStatus(newStatus);

                    String message = "Sensor station status changed to " + newStatus.name();
                    if (Arrays.asList(
                        SensorStationStatus.OFFLINE,
                        SensorStationStatus.PAIRING_FAILED,
                        SensorStationStatus.WARNING
                    ).contains(newStatus)) {
                        logger.warn(message, LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
                    } else {
                        logger.info(message, LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
                    }
                }
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status");
            }
        }

        if (json.containsKey(JSON_KEY_AGGPERIOD)) {
            try {
                Long oldAggregationPeriod = ss.getAggregationPeriod();
                Long newAggregationPeriod = Long.valueOf((Integer)json.get(JSON_KEY_AGGPERIOD));
                if (newAggregationPeriod <= 0) {
                    throw new IllegalArgumentException();
                }

                ss.setAggregationPeriod(newAggregationPeriod);
                if (!newAggregationPeriod.equals(oldAggregationPeriod)) {
                    logger.info("Aggregation period changed by " + authenticatedUser, LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
                }
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid aggregation period");
            }
        }

        if (json.containsKey(JSON_KEY_LOWERBOUND)) {
            try {
                SensorValues newLowerBound = partialValuesUpdate(ss.getLowerBound(), json.get(JSON_KEY_LOWERBOUND));
                ss.setLowerBound(sensorValuesRepository.save(newLowerBound));

                logger.info("Sensor thresholds (lower) updated by " + authenticatedUser, LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
            } catch (Exception e) {
                throw new BadRequestException("Invalid sensor values for lowerBound");
            }
        }
        if (json.containsKey(JSON_KEY_UPPERBOUND)) {
            try {
                SensorValues newUpperBound = partialValuesUpdate(ss.getUpperBound(), json.get(JSON_KEY_UPPERBOUND));
                ss.setUpperBound(sensorValuesRepository.save(newUpperBound));

                logger.info("Sensor thresholds (upper) updated by " + authenticatedUser, LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
            } catch (Exception e) {
                throw new BadRequestException("Invalid sensor values for upperBound");
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
    public ResponseEntity<Collection<String>> getGardenersBySS(@PathVariable(value = "id") Integer id) {
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
    public ResponseEntity<SensorStation> assignGardenerToSS(@PathVariable(value = "id") Integer id, @PathVariable(value = "username") String username) {
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
    public ResponseEntity<SensorStation> removeGardenerFromSS(@PathVariable(value = "id") Integer id, @PathVariable(value = "username") String username) {
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
     * @param photoId id of photo to be deleted
     * @return the picture if found
     */
    @DeleteMapping(value = SS_ID_PHOTOS_PATH + "/{photoId}")
    ResponseEntity<String> deletePhoto(@PathVariable(value = "photoId") Integer photoId, @PathVariable(value = "id") Integer id) {
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
