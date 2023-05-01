package at.qe.skeleton.controllers.api;

import at.qe.skeleton.services.LoggingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rest Controller to display all available logs in the frontend.
 */
@RestController
public class LoggingController {

    @Autowired
    LoggingService loggingService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/logs")
    public ResponseEntity<Object> getAllLogs() {
        return ResponseEntity.ok(loggingService.loadLogs());
    }
}
