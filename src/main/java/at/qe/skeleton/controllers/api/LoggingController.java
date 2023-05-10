package at.qe.skeleton.controllers.api;

import at.qe.skeleton.services.LoggingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Rest Controller to display all available logs in the frontend.
 */
@RestController
public class LoggingController implements BaseRestController{

    @Autowired
    LoggingService loggingService;

    //TODO: add filter for levels
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/logs")
    public ResponseEntity<Object> getAllLogs(@RequestBody Map<String, Object> json) {
        List<String> validLevels = List.of("INFO", "WARN", "ERROR");
        if (json.get("level") instanceof String level) {
            if (validLevels.contains(level)) {
                return ResponseEntity.ok(loggingService.getLogsByLevel(level));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Level not found. Valid levels are 'INFO', 'WARN', and 'ERROR'");
        }
        LocalDateTime from;
        LocalDateTime to;
        if (json.get("from") == null) {
            if (json.get("to") == null) {
                return ResponseEntity.ok(loggingService.getAllLogs());
            }
            if (!(json.get("to") instanceof LocalDateTime)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter valid date format LocalDateTime");
            }
            to = (LocalDateTime) json.get("to");
            return ResponseEntity.ok(loggingService.getAllLogsTo(to));
        }
        if (json.get("to") == null) {
            if (!(json.get("from") instanceof LocalDateTime)){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter valid date format LocalDateTime");
            }
            from = (LocalDateTime) json.get("from");
            return ResponseEntity.ok(loggingService.getAllLogsFrom(from));
        }
        from = (LocalDateTime) json.get("from");
        to = (LocalDateTime) json.get("to");
        if (from.isAfter(to)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("End date should be later than start date");
        }
        return ResponseEntity.ok(loggingService.getAllLogsInTimeInterval(from, to));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/logs/{timestamp}")
    public ResponseEntity<Object> getLogsByDate(@PathVariable(value = "timestamp") LocalDateTime timestamp, @RequestBody Map<String, Object> json) {
        return ResponseEntity.ok(loggingService.getLogsByTimestamp(timestamp));
    }
}
