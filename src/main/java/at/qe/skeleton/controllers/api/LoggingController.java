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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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

    /**
     * GET route to filter logs according to a time interval, the logging level or not at all.
     * A JSON is requested that can contain the parameters "from", "to", and "level".
     * If all of these parameters are set to null, all logs are returned ordered by their timestamp.
     * @param json
     * @return
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/logs")
    public ResponseEntity<Object> getLogs(@RequestBody Map<String, Object> json) {
        List<LoggingEvent> logs;
        if (json.containsKey("from")) {
            if (json.containsKey("to")) {
                try {
                    logs = loggingService.getAllLogsInTimeInterval(json.get("from"), json.get("to"));
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Parameters have wrong format (must be 'yyyy-MM-dd')");
                }
            } else {
                try {
                    logs = loggingService.getAllLogsFrom(json.get("from"));
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Parameter 'from' has wrong format (must be 'yyyy-MM-dd')");
                }
            }
        } else if (json.containsKey("to")) {
            try {
                logs = loggingService.getAllLogsTo(json.get("to"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Parameter 'to' has wrong format (must be 'yyyy-MM-dd')");
            }
        } else {
            logs = loggingService.getAllLogs();
        }
        if (json.containsKey("level")) {
            try {
                logs = loggingService.filterLogsByLevel(logs, json.get("level"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Parameter 'level' has wrong format (must be a String of either 'INFO', 'WARN', or 'ERROR'");
            }
        }
        return ResponseEntity.ok(logs);
    }
}
