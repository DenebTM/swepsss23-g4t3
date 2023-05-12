package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.services.LoggingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@WebAppConfiguration
public class LoggingControllerTest {

    @Autowired
    private LoggingController loggingController;
    @Autowired
    private LoggingService loggingService;

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testGetAllLogs() {
        int numberOfLogs = loggingService.getAllLogs().size();

        var response = loggingController.getLogs(new HashMap<>());
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var logs = response.getBody();
        assertNotNull(logs);
        assertEquals(numberOfLogs, logs.size());
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetLogsFrom(){
        Map<String, Object> json = new HashMap<>();
        String from = "2023-05-10";
        json.put("from", from);

        var response = loggingController.getLogs(json);
        int numberOfLogs = loggingService.getAllLogsFrom(from).size();
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var logs = response.getBody();
        assertNotNull(logs);
        assertEquals(numberOfLogs, logs.size());
        assertTrue(loggingService.getAllLogs().size() >= logs.size());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetLogsTo() {
        Map<String, Object> json = new HashMap<>();
        String to = "2023-05-09";
        json.put("to", to);

        var response = loggingController.getLogs(json);
        int numberOfLogs = loggingService.getAllLogsTo(to).size();
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var logs = response.getBody();
        assertNotNull(logs);
        assertEquals(numberOfLogs, logs.size());
        assertTrue(loggingService.getAllLogs().size() >= logs.size());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetLogsInTimeInterval() {
        Map<String, Object> json = new HashMap<>();
        String from = "2023-05-09";
        String to = "2023-05-11";
        json.put("from", from);
        json.put("to", to);

        var response = loggingController.getLogs(json);
        int numberOfLogs = loggingService.getAllLogsInTimeInterval(from, to).size();
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var logs = response.getBody();
        assertNotNull(logs);
        assertEquals(numberOfLogs, logs.size());
        assertTrue(loggingService.getAllLogs().size() > logs.size());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetLogsByLevel() {
        Map<String, Object> json = new HashMap<>();
        List<String> levels = List.of("INFO", "WARN", "ERROR");
        
        int totalFilteredLogCount = 0;
        for (String s : levels) {
            json.put("level", s);
            var serviceLogs = loggingService.getAllLogs();
            serviceLogs = loggingService.filterLogsByLevel(serviceLogs, s);

            var response = loggingController.getLogs(json);
            int numberOfLogs = serviceLogs.size();
            assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

            var logs = response.getBody();
            assertNotNull(logs);
            assertEquals(numberOfLogs, logs.size());
            totalFilteredLogCount += logs.size();
        }

        assertTrue(totalFilteredLogCount <= loggingService.getAllLogs().size());
    }
}
