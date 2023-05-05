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
    public ResponseEntity<Object> getAllLogs() {
        return ResponseEntity.ok(loggingService.getAllLogs());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/logs/{timestamp}")
    public ResponseEntity<Object> getLogsByDate(@PathVariable(value = "timestamp") LocalDateTime timestamp, @RequestBody Map<String, Object> json) {
        return ResponseEntity.ok(loggingService.loadLogsByTimestamp(timestamp));
    }
}
