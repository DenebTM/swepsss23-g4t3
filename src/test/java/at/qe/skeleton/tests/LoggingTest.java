package at.qe.skeleton.tests;

import net.bytebuddy.asm.MemberSubstitution;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

import java.io.File;
import java.sql.*;

/**
 * Tests logging with logback in four different cases: writing info, warning and error messages to a file
 * separately and logging to the database.
 */
@SpringBootTest
@WebAppConfiguration
public class LoggingTest {

    private static final Logger logger = LoggerFactory.getLogger(LoggingTest.class);

    @Test
    void testInfoLog() {
        logger.info("Test info message");
        File info = new File("logs/info.log");
        Assertions.assertTrue(info.exists());
        Assertions.assertTrue(info.length() > 0);
    }

    @Test
    void testWarnLog() {
        logger.warn("Test warn message");
        File warn = new File("logs/warnError.log");
        Assertions.assertTrue(warn.exists());
        Assertions.assertTrue(warn.length() > 0);
    }

    @Test
    void testErrorLog() {
        logger.error("Test error message");
        File error = new File("logs/warnError.log");
        Assertions.assertTrue(error.exists());
        Assertions.assertTrue(error.length() > 0);
    }

    @Test
    void testDbLog() throws SQLException {
        logger.info("Test info message");
        ResultSet rs = null;
        try {
            String url = "jdbc:h2:mem:skel";
            Connection con = DriverManager.getConnection(url, "sa", "password");

            Statement stmt = con.createStatement();
            rs = stmt.executeQuery("SELECT * from LOGGING_EVENT");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        Assertions.assertNotNull(rs);
    }
}
