package at.qe.skeleton.controllers.errors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

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

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<String> unauthorizedHandler(AccessDeniedException ex, WebRequest request) {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(ex.getMessage());
    }

    @ExceptionHandler({
        ForbiddenException.class,
        BadCredentialsException.class,
        DisabledException.class,
        AuthenticationCredentialsNotFoundException.class
    })
    ResponseEntity<String> forbiddenHandler(RuntimeException ex, WebRequest request) {
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ex.getMessage());
    }
}
