package at.qe.skeleton.controllers.api;

import at.qe.skeleton.model.UserRole;
import at.qe.skeleton.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserxRestController implements BaseRestController {

    @Autowired
    private UserService userService;

    @GetMapping(value ="/users")
    public ResponseEntity<Object> getUsers() {
        if (!userService.getAuthenticatedUser().getRoles().contains(UserRole.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions. Admin level permissions are required.");
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
