package at.qe.skeleton.tests;

import at.qe.skeleton.controllers.api.LoggingControllerTest;
import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.services.LoggingService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@SpringBootTest
@WebAppConfiguration
public class LoggingServiceTest {

    private static final Logger logger = LoggerFactory.getLogger(LoggingControllerTest.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    LoggingService loggingService;
    
    @Test
    void getLogsFrom() {
        LocalDate fromDate = LocalDate.parse("2023-05-10", formatter);
        ZonedDateTime zoneFrom = ZonedDateTime.of(fromDate.atTime(0, 0, 0), ZoneId.systemDefault());

        List<LoggingEvent> logs = loggingService.getAllLogsFrom("2023-05-10");
        Assertions.assertTrue(logs.size() < loggingService.getAllLogs().size());
        Assertions.assertTrue(logs.size() > 0);
        for (LoggingEvent l :
                logs) {
            Assertions.assertTrue(zoneFrom.toInstant().toEpochMilli() <= l.getTimestmp());
        }
    }

    @Test
    void testGetLogsTo() {
        LocalDate toDate = LocalDate.parse("2023-05-12", formatter);
        ZonedDateTime zoneTo = ZonedDateTime.of(toDate.atTime(23, 59, 59), ZoneId.systemDefault());

        List<LoggingEvent> logs = loggingService.getAllLogsTo("2023-05-12");
        Assertions.assertTrue(logs.size() > 0);
        for (LoggingEvent l :
                logs) {
            Assertions.assertTrue(zoneTo.toInstant().toEpochMilli() >= l.getTimestmp());
        }
    }

    @Test
    void testGetLogsInTimeInterval() {
        LocalDate fromDate = LocalDate.parse("2023-05-10", formatter);
        LocalDate toDate = LocalDate.parse("2023-05-12", formatter);
        ZonedDateTime zoneFrom = ZonedDateTime.of(fromDate.atTime(0, 0, 0), ZoneId.systemDefault());
        ZonedDateTime zoneTo = ZonedDateTime.of(toDate.atTime(23, 59, 59), ZoneId.systemDefault());

        List<LoggingEvent> logs = loggingService.getAllLogsInTimeInterval("2023-05-10", "2023-05-12");
        Assertions.assertTrue(logs.size() > 0);
        for (LoggingEvent l :
                logs) {
            Assertions.assertTrue(zoneFrom.toInstant().toEpochMilli() <= l.getTimestmp());
            Assertions.assertTrue(zoneTo.toInstant().toEpochMilli() >= l.getTimestmp());
        }
    }

    @Test
    void testGetLogsByLevel() {
        logger.info("info log");
        List<LoggingEvent> infoLogs = loggingService.getLogsByLevel("INFO");
        for (LoggingEvent l :
                infoLogs) {
            Assertions.assertEquals("INFO", l.getLevelString());
        }
        logger.warn("warn log");
        List<LoggingEvent> warnLogs = loggingService.getLogsByLevel("WARN");
        for (LoggingEvent l :
                warnLogs) {
            Assertions.assertEquals("WARN", l.getLevelString());
        }
        logger.error("error log");
        List<LoggingEvent> errorLogs = loggingService.getLogsByLevel("ERROR");
        for (LoggingEvent l :
                errorLogs) {
            Assertions.assertEquals("ERROR", l.getLevelString());
        }
    }
}
