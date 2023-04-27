package at.qe.skeleton.tests;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;

@SpringBootTest
public class LoggingTest {

    private static final Logger logger = LoggerFactory.getLogger(LoggingTest.class);

    @Test
    void testInfoLog() {
        logger.info("Test info message");
        File info = new File("/logs/info.log");
        Assertions.assertTrue(info.exists());
        Assertions.assertTrue(info.length() > 0);
    }

    @Test
    void testWarnLog() {
        logger.warn("Test warn message");
        File warn = new File("/logs/warnError.log");
        Assertions.assertTrue(warn.exists());
        Assertions.assertTrue(warn.length() > 0);
    }

    @Test
    void testErrorLog() {
        logger.error("Test error message");
        File error = new File("/logs/warnError.log");
        Assertions.assertTrue(error.exists());
        Assertions.assertTrue(error.length() > 0);
    }
}
