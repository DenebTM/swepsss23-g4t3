package at.qe.skeleton.ui.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import at.qe.skeleton.configs.jwtutils.JwtManager;
import at.qe.skeleton.configs.jwtutils.models.LoginRequestModel;
import at.qe.skeleton.configs.jwtutils.models.LoginResponseModel;

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

    @PostMapping("/handle-login")
    public ResponseEntity<Object> createToken(@RequestBody LoginRequestModel request) {
        String username = request.getUsername();
        if (username == null){
            return ResponseEntity.status(400).body("Missing body key \"username\"");
        }
        if (request.getPassword()== null){
            return ResponseEntity.status(400).body("Missing body key \"password\"");
        }

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username,
                request.getPassword());
        try {
            // Authenticate user and set Authentication object in SecurityContext
            org.springframework.security.core.Authentication authentication = authenticationManager
                    .authenticate(authToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (DisabledException e) {
            return ResponseEntity.status(403).body("User is disabled");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(403).body("Incorrect username or password");
        } catch (AuthenticationCredentialsNotFoundException e) {
            return ResponseEntity.status(403).body("No authentication credentials provided");
        }
        // Generate and return a new JWT
        final String jwtToken = tokenManager.generateJwtToken(username);
        return ResponseEntity.ok(new LoginResponseModel(jwtToken));
    }
}