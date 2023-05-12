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

    @Autowired
    LoggingService loggingService;
    
    @Test
    void getLogsFrom() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate fromDate = LocalDate.parse("2023-05-02", formatter);
        ZonedDateTime zoneFrom = ZonedDateTime.of(fromDate.atTime(0, 0, 0), ZoneId.systemDefault());

        List<LoggingEvent> logs = loggingService.getAllLogsFrom("2023-05-02");
        Assertions.assertTrue(logs.size() > 0);
        for (LoggingEvent l :
                logs) {
            Assertions.assertTrue(zoneFrom.toInstant().toEpochMilli() <= l.getTimestmp());
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
