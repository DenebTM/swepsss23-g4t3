package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.services.LoggingService;
import at.qe.skeleton.tests.LoggingTest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class LoggingControllerTest {

    @Autowired
    private LoggingController loggingController;
    @Autowired
    private LoggingService loggingService;

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testGetAllLogs() {
        ResponseEntity logs = loggingController.getLogs(new HashMap<>());
        int numberOfLogs = loggingService.getAllLogs().size();
        Assertions.assertEquals(HttpStatusCode.valueOf(200), logs.getStatusCode());
        try {
            Assertions.assertEquals(numberOfLogs, ((Collection) logs.getBody()).size());
            Assertions.assertTrue(((Collection) logs.getBody()).size() > 0);
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetLogsFrom(){
        Map<String, Object> json = new HashMap<>();
        json.put("from", "2023-05-03");
        Object from = "2023-05-03";
        ResponseEntity logs = loggingController.getLogs(json);
        int numberOfLogs = loggingService.getAllLogsFrom(from).size();
        Assertions.assertEquals(HttpStatusCode.valueOf(200), logs.getStatusCode());
        try {
            Assertions.assertEquals(numberOfLogs, ((Collection) logs.getBody()).size());
            Assertions.assertTrue(((Collection) logs.getBody()).size() > 0);
            Assertions.assertNotEquals(loggingService.getAllLogs().size(), ((Collection) logs.getBody()).size());
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetLogsTo() {
        Map<String, Object> json = new HashMap<>();
        json.put("to", "2023-05-03");
        Object to = "2023-05-03";
        ResponseEntity logs = loggingController.getLogs(json);
        int numberOfLogs = loggingService.getAllLogsTo(to).size();
        Assertions.assertEquals(HttpStatusCode.valueOf(200), logs.getStatusCode());
        try {
            Assertions.assertEquals(numberOfLogs, ((Collection) logs.getBody()).size());
            Assertions.assertTrue(((Collection) logs.getBody()).size() > 0);
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetLogsInTimeInterval() {
        Map<String, Object> json = new HashMap<>();
        json.put("from", "2023-01-01");
        json.put("to", "2023-05-01");
        Object from = "2023-01-01";
        Object to = "2023-05-01";
        ResponseEntity logs = loggingController.getLogs(json);
        System.out.println();
        int numberOfLogs = loggingService.getAllLogsInTimeInterval(from, to).size();
        Assertions.assertEquals(HttpStatusCode.valueOf(200), logs.getStatusCode());
        try {
            Assertions.assertEquals(numberOfLogs, ((Collection) logs.getBody()).size());
            Assertions.assertTrue(((Collection) logs.getBody()).size() > 0);
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetLogsByLevel() {
        Map<String, Object> json = new HashMap<>();
        List<String> levels = List.of("INFO", "WARN", "ERROR");
        for (String s :
                levels) {
            json.put("level", s);
            ResponseEntity controllerLogs = loggingController.getLogs(json);
            List<LoggingEvent> serviceLogs = loggingService.getAllLogs();
            loggingService.filterLogsByLevel(serviceLogs, s);
            int numberOfLogs = serviceLogs.size();
            Assertions.assertEquals(HttpStatusCode.valueOf(200), controllerLogs.getStatusCode());
            try {
                Assertions.assertEquals(numberOfLogs, ((Collection) controllerLogs.getBody()).size());
                Assertions.assertTrue(((Collection) controllerLogs.getBody()).size() > 0);
            } catch (NullPointerException e) {
                e.printStackTrace();
            }
        }
    }
}
