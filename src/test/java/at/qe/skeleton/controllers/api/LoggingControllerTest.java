package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.models.LoggingEventJson;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.models.enums.LogLevel;
import at.qe.skeleton.services.LoggingService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import java.time.*;
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
        assertEquals(HttpStatus.OK, response.getStatusCode());

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
        assertEquals(HttpStatus.OK, response.getStatusCode());

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
        assertEquals(HttpStatus.OK, response.getStatusCode());

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
        assertEquals(HttpStatus.OK, response.getStatusCode());

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
            assertEquals(HttpStatus.OK, response.getStatusCode());

            var logs = response.getBody();
            assertNotNull(logs);
            assertEquals(numberOfLogs, logs.size());
            totalFilteredLogCount += logs.size();
        }

        assertTrue(totalFilteredLogCount <= loggingService.getAllLogs().size());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testSendLogs() {
        Assertions.assertThrows(
            NotFoundInDatabaseException.class,
            () -> loggingController.sendLogs("someRandomNameThatDoesntExist", List.of())
        );

        List<LoggingEvent> repoLogs = loggingService.getAllLogs();
        List<LoggingEventJson> jsonLogs = new ArrayList<>(repoLogs.size());

        for (LoggingEvent l : repoLogs) {
            jsonLogs.add(new LoggingEventJson(
                l.getEventId(),
                LocalDateTime.now().toInstant(ZoneOffset.UTC),
                LogLevel.INFO,
                "Some test message",
                new LoggingEventJson.LogEntity(LogEntityType.USER, 1))
            );
        }

        ResponseEntity<List<LoggingEventJson>> foundLogs = loggingController.sendLogs("AP 1", jsonLogs);

        List<Long> repoIds = repoLogs.stream().map(LoggingEvent::getEventId).sorted().toList();
        List<Long> foundIds = Objects.requireNonNull(foundLogs.getBody()).stream().map(LoggingEventJson::getId).sorted().toList();

        Assertions.assertEquals(repoIds, foundIds);

    }
}
