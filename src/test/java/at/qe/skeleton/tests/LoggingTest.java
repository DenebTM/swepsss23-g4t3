package at.qe.skeleton.tests;

import ch.qos.logback.classic.LoggerContext;
import org.jboss.weld.environment.util.Files;
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

}
