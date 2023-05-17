package at.qe.skeleton.tests;

import at.qe.skeleton.controllers.api.LoggingControllerTest;
import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.models.enums.LogLevel;
import at.qe.skeleton.services.LoggingService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@SpringBootTest
@WebAppConfiguration
public class LoggingServiceTest {

    private static final Logger logger = LoggerFactory.getLogger(LoggingControllerTest.class);

    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
    private static Instant parseInstant(String charseq) {
        LocalDate date = LocalDate.parse(charseq, formatter);
        ZonedDateTime zoneDate = ZonedDateTime.of(date.atTime(0, 0, 0), ZoneId.systemDefault());

        return zoneDate.toInstant();
    }

    @Autowired
    LoggingService loggingService;
    
    @Test
    void testGetLogsFrom() {
        Instant fromDate = parseInstant("2023-05-10");

        List<LoggingEvent> logs = loggingService.getAllLogsFrom(fromDate);
        Assertions.assertTrue(logs.size() <= loggingService.getAllLogs().size());
        for (LoggingEvent l : logs) {
            Assertions.assertTrue(fromDate.toEpochMilli() <= l.getTimestmp());
        }
    }

    @Test
    void testGetLogsTo() {
        Instant toDate = parseInstant("2023-05-12");

        List<LoggingEvent> logs = loggingService.getAllLogsTo(toDate);
        Assertions.assertTrue(logs.size() <= loggingService.getAllLogs().size());
        for (LoggingEvent l : logs) {
            Assertions.assertTrue(toDate.toEpochMilli() >= l.getTimestmp());
        }
    }

    @Test
    void testGetLogsInTimeInterval() {
        Instant fromDate = parseInstant("2023-05-10");
        Instant toDate = parseInstant("2023-05-12");

        List<LoggingEvent> logs = loggingService.getAllLogsInTimeInterval(fromDate, toDate);
        Assertions.assertTrue(logs.size() <= loggingService.getAllLogs().size());
        for (LoggingEvent l : logs) {
            Assertions.assertTrue(fromDate.toEpochMilli() <= l.getTimestmp());
            Assertions.assertTrue(toDate.toEpochMilli() >= l.getTimestmp());
        }
    }

    @Test
    void testGetLogsByLevel() {
        logger.info("info log");
        List<LoggingEvent> infoLogs = loggingService.getLogsByLevel(LogLevel.INFO);
        for (LoggingEvent l : infoLogs) {
            Assertions.assertEquals(LogLevel.INFO, l.getLevel());
        }
        logger.warn("warn log");
        List<LoggingEvent> warnLogs = loggingService.getLogsByLevel(LogLevel.WARN);
        for (LoggingEvent l : warnLogs) {
            Assertions.assertEquals(LogLevel.WARN, l.getLevel());
        }
        logger.error("error log");
        List<LoggingEvent> errorLogs = loggingService.getLogsByLevel(LogLevel.ERROR);
        for (LoggingEvent l : errorLogs) {
            Assertions.assertEquals(LogLevel.ERROR, l.getLevel());
        }
    }
}
