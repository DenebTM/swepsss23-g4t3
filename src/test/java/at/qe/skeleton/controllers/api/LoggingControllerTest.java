package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.services.LoggingService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.Collection;
import java.util.List;

@SpringBootTest
public class LoggingControllerTest {

    @Autowired
    private LoggingController loggingController;
    @Autowired
    private LoggingService loggingService;

    @Test
    public void testGetAllLogs() {
        ResponseEntity logs = loggingController.getAllLogs();
        int numberOfLogs = loggingService.getAllLogs().size();
        Assertions.assertEquals(HttpStatusCode.valueOf(200), logs.getStatusCode());
        try {
            Assertions.assertEquals(numberOfLogs, ((Collection) logs.getBody()).size());
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }
}
