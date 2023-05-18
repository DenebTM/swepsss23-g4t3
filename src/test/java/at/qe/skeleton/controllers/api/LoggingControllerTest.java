package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.enums.LogLevel;
import at.qe.skeleton.services.LoggingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@WebAppConfiguration
public class LoggingControllerTest {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
    private static Instant parseInstant(String charseq) {
        LocalDate date = LocalDate.parse(charseq, formatter);
        ZonedDateTime zoneDate = ZonedDateTime.of(date.atTime(0, 0, 0), ZoneId.systemDefault());

        return zoneDate.toInstant();
    }

    @Autowired
    private LoggingRestController loggingController;
    @Autowired
    private LoggingService loggingService;

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testGetAllLogs() {
        int numberOfLogs = loggingService.getAllLogs().size();

        var response = loggingController.getLogs(null, null, null, null);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var logs = response.getBody();
        assertNotNull(logs);
        assertEquals(numberOfLogs, logs.size());
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetLogsFrom(){
        Instant from = parseInstant("2023-05-09");

        var response = loggingController.getLogs(from, null, null, null);
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
        Instant to = parseInstant("2023-05-09");

        var response = loggingController.getLogs(null, to, null, null);
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
        Instant from = parseInstant("2023-05-09");
        Instant to = parseInstant("2023-05-11");

        var response = loggingController.getLogs(from, to, null, null);
        int numberOfLogs = loggingService.getAllLogsInTimeInterval(from, to).size();
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var logs = response.getBody();
        assertNotNull(logs);
        assertEquals(numberOfLogs, logs.size());
        assertTrue(loggingService.getAllLogs().size() >= logs.size());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetLogsByLevel() {
        Map<String, Object> json = new HashMap<>();
        
        int totalFilteredLogCount = 0;
        for (LogLevel level : LogLevel.values()) {
            json.put("level", level);
            var serviceLogs = loggingService.getAllLogs();
            serviceLogs = loggingService.filterLogsByLevelIn(serviceLogs, Arrays.asList(level));

            var response = loggingController.getLogs(null, null, Arrays.asList(level), null);
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
