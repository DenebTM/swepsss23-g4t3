package at.qe.skeleton.tests;

import at.qe.skeleton.controllers.api.LoggingController;
import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.services.LoggingService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

import java.io.File;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Tests logging with logback in four different cases: writing info, warning and error messages to a file
 * separately and logging to the database.
 * Maybe have a look at: https://mincong.io/2020/02/02/logback-test-logging-event/
 */
@SpringBootTest
@WebAppConfiguration
public class LoggingTest {

    private static final Logger logger = LoggerFactory.getLogger(LoggingTest.class);
    private Map<String, Object> json = new HashMap<>();

    @Autowired
    LoggingService loggingService;

    @Test
    void testInfoLog() {
        File info = new File("logs/info.log");
        long oldFileLength = info.length();
        logger.info("Test info message");
        long newFileLength = info.length();
        Assertions.assertTrue(newFileLength > oldFileLength);
    }

    @Test
    void testWarnLog() {
        File warn = new File("logs/warnError.log");
        long oldFileLength = warn.length();
        logger.warn("Test warn message");
        long newFileLength = warn.length();
        Assertions.assertTrue(newFileLength > oldFileLength);
    }

    @Test
    void testErrorLog() {
        File error = new File("logs/warnError.log");
        long oldFileLength = error.length();
        logger.error("Test warn message");
        long newFileLength = error.length();
        Assertions.assertTrue(newFileLength > oldFileLength);
    }

    @Test
    void testDbLog() throws SQLException {
        logger.info("Test info message");
        ResultSet rs = null;
        try {
            String url = "jdbc:mysql://localhost:3306/swe";
            Connection con = DriverManager.getConnection(url, "root", "password");

            Statement stmt = con.createStatement();
            rs = stmt.executeQuery("SELECT * from LOGGING_EVENT");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        Assertions.assertNotNull(rs);
    }

    @Test
    void testGetAllLogs() {
        List<LoggingEvent> oldLogs = loggingService.getAllLogs();
        logger.info("Test something");
        List<LoggingEvent> newLogs = loggingService.getAllLogs();
        Assertions.assertTrue(newLogs.size() > oldLogs.size());
    }
}
