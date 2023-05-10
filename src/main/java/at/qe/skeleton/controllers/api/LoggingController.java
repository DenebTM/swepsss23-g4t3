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
                //neither 'level', 'from' or 'to' are set, logs are returned unfiltered
                return ResponseEntity.ok(loggingService.getAllLogs());
            }
            if (!(json.get("to") instanceof LocalDateTime)) {
                //'to' exist but has incorrect format
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter valid date format LocalDateTime");
            }
            //'from' is null but 'to' is set, logs are returned from the earliest timestamp to the one set in 'to'
            to = (LocalDateTime) json.get("to");
            return ResponseEntity.ok(loggingService.getAllLogsTo(to));
        }
        if (json.get("to") == null) {
            if (!(json.get("from") instanceof LocalDateTime)){
                //'from' exist but has incorrect format
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter valid date format LocalDateTime");
            }
            //'to' is null but 'from' is set, logs are returned from the timestamp set in 'from' to the latest timestamp
            from = (LocalDateTime) json.get("from");
            return ResponseEntity.ok(loggingService.getAllLogsFrom(from));
        }
        from = (LocalDateTime) json.get("from");
        to = (LocalDateTime) json.get("to");
        if (from.isAfter(to)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("End date should be later than start date");
        }
        //both 'from' and 'to' are set sensibly
        return ResponseEntity.ok(loggingService.getAllLogsInTimeInterval(from, to));
    }
}
