package at.qe.skeleton.controllers.api;

import at.qe.skeleton.model.UserRole;
import at.qe.skeleton.model.Userx;
import at.qe.skeleton.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping(value="/users/{username}")
    public ResponseEntity<Object> getUserByUsername(@PathVariable(value = "username") String username) {
        Userx userx = userService.loadUserByUsername(username);

        // Return a 404 error if the User is not found
        if (userx == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with username: \"" + username + "\" not found.");
        }

        // Return a 403 error if a non-admin and not user itself tries to get User
//        if (!userService.getAuthenticatedUser().getRole().equals(UserRole.ADMIN) || (userx.equals(userService.getAuthenticatedUser()))) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have access to this user.");
//        }

        return ResponseEntity.status(HttpStatus.OK).body(userx);
    }
}
