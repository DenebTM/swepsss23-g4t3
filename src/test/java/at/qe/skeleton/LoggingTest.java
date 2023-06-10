package at.qe.skeleton;

import at.qe.skeleton.services.LoggingService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

import java.io.File;
import java.sql.*;

/**
 * Tests logging with logback in four different cases: writing info, warning and error messages to a file
 * separately and logging to the database.
 * Maybe have a look at: https://mincong.io/2020/02/02/logback-test-logging-event/
 */
@SpringBootTest
@WebAppConfiguration
public class LoggingTest {

    @Value("${spring.datasource.url}")
    String dataSourceUrl;
    @Value("${spring.datasource.username}")
    String dataSourceUsername;
    @Value("${spring.datasource.password}")
    String dataSourcePassword;

    private static final Logger logger = LoggerFactory.getLogger(LoggingTest.class);

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
        logger.error("Test error message");
        long newFileLength = error.length();
        Assertions.assertTrue(newFileLength > oldFileLength);
    }

    @Test
    void testDbLog() throws SQLException {
        logger.info("Test info message");
        ResultSet rs = null;
        try {
            Connection con = DriverManager.getConnection(
                dataSourceUrl,
                dataSourceUsername,
                dataSourcePassword
            );

            Statement stmt = con.createStatement();
            rs = stmt.executeQuery("SELECT * from logging_event");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        Assertions.assertNotNull(rs);
    }
}
