package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.models.LoggingEventJson;
import at.qe.skeleton.models.LoggingEventProperty;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.models.enums.LogLevel;
import at.qe.skeleton.repositories.LoggingEventPropertyRepository;
import at.qe.skeleton.services.AccessPointService;
import at.qe.skeleton.services.LoggingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Rest Controller to display all available logs in the frontend.
 */
@RestController
public class LoggingRestController implements BaseRestController {

    @Autowired
    AccessPointService apService;

    @Autowired
    LoggingService loggingService;

    @Autowired
    LoggingEventPropertyRepository propertyRepository;

    /**
     * GET route to filter logs according to a time interval, the logging level or not at all.
     * A JSON is requested that can contain the parameters "from", "to", and "level".
     * If all of these parameters are set to null, all logs are returned ordered by their timestamp.
     * @param json
     * @return
     */
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GARDENER', 'USER')")
    @GetMapping("/logs")
    public ResponseEntity<List<LoggingEventJson>> getLogs(
        @RequestParam(value = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Instant from,
        @RequestParam(value = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Instant to,
        @RequestParam(value = "level", required = false) List<LogLevel> levels,
        @RequestParam(value = "origin", required = false) String originType
    ) {
        List<LoggingEventProperty> props = propertyRepository.findAll();

        return ResponseEntity.ok(
            // get logs from database
            loggingService.filterLogsByLevelIn(
                loggingService.getAllLogsInTimeInterval(from, to),
                levels
            ).stream()
            // convert logs to return type
            .map(event -> new LoggingEventJson(
                event,
                props.stream()
                    .filter(prop -> prop.getEventId() == event.getEventId())
                    .toList()
            ))
            // filter by origin
            .filter(event -> {
                if (originType != null) {
                    // require entity type be present
                    if (event.getOrigin() == null) {
                        return false;
                    }

                    // optionally filter for specific entity type
                    if (!originType.equals("any") && !event.getOrigin().getType().name().equals(originType)) {
                        return false;
                    }
                }

                return true;
            })
            .collect(Collectors.toList())
        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(AccessPointRestController.AP_NAME_PATH + "/logs")
    public ResponseEntity<List<LoggingEventJson>> sendLogs(
        @PathVariable(value = "name") String name,
        @RequestBody List<LoggingEventJson> logs
    ) {
        AccessPoint ap = apService.loadAPByName(name);
        // Return a 404 error if the access point is not found
        if (ap == null) {
            throw new NotFoundInDatabaseException(AccessPointRestController.AP, name);
        }

        List<LoggingEventJson> returnList = new ArrayList<>(logs.size());

        for (LoggingEventJson log : logs) {
            // save the log entry
            var savedLog = loggingService.saveLog(new LoggingEvent(
                log.getMessage(),
                log.getLevel(),
                log.getTimestamp().toEpochMilli()
            ));

            // associate the log entry with the send access point
            var logProp = new LoggingEventProperty(
                savedLog.getEventId(),
                LogEntityType.ACCESS_POINT.name(),
                ap.getName()
            );
            propertyRepository.save(logProp);

            returnList.add(new LoggingEventJson(savedLog, Arrays.asList(logProp)));
        }

        return ResponseEntity.ok(returnList);
    }
}
