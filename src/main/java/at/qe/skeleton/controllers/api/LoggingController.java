package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.services.LoggingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.DateTimeException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

/**
 * Rest Controller to display all available logs in the frontend.
 */
@RestController
public class LoggingController implements BaseRestController{

    @Autowired
    LoggingService loggingService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/logs")
    public ResponseEntity<Object> getAllLogs(@RequestBody Map<String, Object> json) {
        if (!(json.get("from") instanceof LocalDateTime from) || !(json.get("to") instanceof LocalDateTime to)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter valid date format LocalDateTime");
        }
        // if keys "from" and "to" are missing in json body return all logs
        if (!json.containsKey("from") && !json.containsKey("to")){
            return ResponseEntity.ok(loggingService.getAllLogs());
        }
        // only ending is set
        if (!json.containsKey("from") && json.containsKey("to")){
            return ResponseEntity.ok(loggingService.getAllLogsTo(to));
        }
        // only beginning is set
        if (json.containsKey("from")) {
            return ResponseEntity.ok(loggingService.getAllLogsFrom(from));
        }
        // return 400 error if "from"-date is after "to"-date
        if (from.isAfter(to)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("End date should be later than start date");
        }
        return ResponseEntity.ok(loggingService.getAllLogsInTimeInterval(from, to));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/logs/{timestamp}")
    public ResponseEntity<Object> getLogsByDate(@PathVariable(value = "timestamp") LocalDateTime timestamp, @RequestBody Map<String, Object> json) {
        return ResponseEntity.ok(loggingService.loadLogsByTimestamp(timestamp));
    }
}
