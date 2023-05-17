package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.LoggingEventJson;
import at.qe.skeleton.services.LoggingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Rest Controller to display all available logs in the frontend.
 */
@RestController
public class LoggingRestController implements BaseRestController {

    @Autowired
    LoggingService loggingService;

    /**
     * GET route to filter logs according to a time interval, the logging level or not at all.
     * A JSON is requested that can contain the parameters "from", "to", and "level".
     * If all of these parameters are set to null, all logs are returned ordered by their timestamp.
     * @param json
     * @return
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/logs")
    public ResponseEntity<List<LoggingEventJson>> getLogs(
        @RequestParam(value = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Instant from,
        @RequestParam(value = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Instant to,
        @RequestParam(value = "level", required = false) String level
    ) {
        return ResponseEntity.ok(
            loggingService.filterLogsByLevel(
                loggingService.getAllLogsInTimeInterval(from, to),
                level
            ).stream()
            .map(p -> new LoggingEventJson(p, null))
            .collect(Collectors.toList())
        );
    }
}
