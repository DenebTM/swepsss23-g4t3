package at.qe.skeleton.controllers.api;

import at.qe.skeleton.services.LoggingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
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
        Instant from = Instant.now();       // if "from"-date is present in json body, it will be changed to that date
        Instant to = Instant.now();         // if "to"-date is present in json body, it will be changed to that date

        // if keys "from" and "to" are missing in json body return the most recent/current measurement
        if (!json.containsKey("from") && !json.containsKey("to")){
            Measurement currentMeasurement = measurementService.getCurrentMeasurement(id);
            if (currentMeasurement == null){
                return ResponseEntity.ok(new ArrayList<>());
            } else {
                return ResponseEntity.ok(new ArrayList<>(Arrays.asList(currentMeasurement)));
            }
        }
        // return a 400 error if there is a "to"-date but no "from"-date given in json body
        if (!json.containsKey("from") && json.containsKey("to")){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid start date");
        }
        // return 400 error if "from"-date isn't iso formatted
        if (json.containsKey("from")) {
            try {
                from = Instant.parse((String)json.get("from"));
            } catch (DateTimeException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid start date");
            }
        }
        // return 400 error if "to"-date isn't iso formatted
        if (json.containsKey("to")) {
            try {
                to = Instant.parse((String)json.get("to"));
            } catch (DateTimeException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid end date");
            }
        }
        // return 400 error if "from"-date is after "to"-date
        if (from.isAfter(to)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("End date should be later than start date");
        }
        return ResponseEntity.ok(loggingService.getAllLogs(from, to));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/logs/{timestamp}")
    public ResponseEntity<Object> getLogsByDate(@PathVariable(value = "timestamp") LocalDateTime timestamp, @RequestBody Map<String, Object> json) {
        return ResponseEntity.ok(loggingService.loadLogsByTimestamp(timestamp));
    }
}
