package at.qe.skeleton.controllers.api;

import at.qe.skeleton.repositories.LoggingEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoggingController {

    @Autowired
    LoggingEventRepository loggingEventRepository;

    @GetMapping("/logs")
    public ResponseEntity<Object> getAllLogs() {
        return ResponseEntity.ok(loggingEventRepository.findAll());
    }
}
