package at.qe.skeleton.controllers.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.logging.LogManager;
import java.util.logging.Logger;

public class LoggingController implements BaseRestController{

    private static final Logger logInfo = LogManager.getLogManager().getLogger("info-log");
    private static final Logger logWarnError = LogManager.getLogManager().getLogger("war-error-log");

}
