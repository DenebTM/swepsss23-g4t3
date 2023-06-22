package at.qe.skeleton.controllers.errors;

import javax.naming.SizeLimitExceededException;

import org.apache.tomcat.util.http.fileupload.impl.FileSizeLimitExceededException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

/**
 * This class defines custom exception handlers for the ReST controllers
 * 
 * This allows us to throw exceptions when a request cannot be fulfilled,
 * and centrally manage what is returned in that case.
 * 
 * Spring's built-in `AccessDeniedException` is used for 401 errors, custom
 * exception types are defined for everything else.
 */
@ControllerAdvice
public class ErrorHandler {

    @ExceptionHandler(NotFoundInDatabaseException.class)
    ResponseEntity<String> notFoundHandler(NotFoundInDatabaseException ex, WebRequest request) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    ResponseEntity<String> badRequestHandler(BadRequestException ex, WebRequest request) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ex.getMessage());
    }

    @ExceptionHandler({
        AccessDeniedException.class,
        AuthenticationCredentialsNotFoundException.class
    })
    ResponseEntity<String> unauthorizedHandler(AccessDeniedException ex, WebRequest request) {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(ex.getMessage());
    }

    @ExceptionHandler({
        ForbiddenException.class,
        BadCredentialsException.class,
        DisabledException.class
    })
    ResponseEntity<String> forbiddenHandler(RuntimeException ex, WebRequest request) {
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    ResponseEntity<String> requestParamTypeMismatchHandler(MethodArgumentTypeMismatchException ex) {
        String name = ex.getName();
        @SuppressWarnings("null")
        String type = ex.getRequiredType().getSimpleName();
        Object value = ex.getValue();
        String message = String.format("Invalid %s value for '%s': %s", type, name, value);

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(message);
    }

    @ExceptionHandler({
        SizeLimitExceededException.class,
        FileSizeLimitExceededException.class,
        MaxUploadSizeExceededException.class
    })
    ResponseEntity<String> maxUploadSizeExceededHandler(Exception e) {
        return ResponseEntity
            .status(HttpStatus.PAYLOAD_TOO_LARGE)
            .body("Upload file size too large (max 8 MiB)");
    }

}
