package at.qe.skeleton.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import at.qe.skeleton.configs.jwtutils.JwtManager;
import at.qe.skeleton.configs.jwtutils.models.LoginRequestModel;
import at.qe.skeleton.configs.jwtutils.models.LoginResponseModel;
import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.services.LoggingService;

/**
 * Rest controller to authenticate a login request and return a generated JWT
 * Heavily based on this tutorial:
 * https://www.tutorialspoint.com/spring_security/spring_security_with_jwt.htm
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtManager tokenManager;

    @Autowired
    private LoggingService logger;

    @PostMapping("/handle-login")
    public ResponseEntity<LoginResponseModel> createToken(@RequestBody LoginRequestModel request) {
        if (request.getUsername() == null){
            throw new BadRequestException("Missing body key \"username\"");
        }
        if (request.getPassword() == null){
            throw new BadRequestException("Missing body key \"password\"");
        }
        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            );

        // Authenticate user and set Authentication object in SecurityContext
        try {
            Authentication authentication =
                authenticationManager.authenticate(authToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            logger.info("User authenticated successfully", LogEntityType.USER, request.getUsername(), getClass());
        } catch (Exception e) {
            logger.info("Failed to authenticate user", LogEntityType.USER, request.getUsername(), getClass());

            throw e;
        }

        // Generate and return a new JWT
        final String jwt = tokenManager.generateJwtToken(request.getUsername());
        return ResponseEntity.ok().body(new LoginResponseModel(jwt));
    }
}
