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

    /**
     * Route to GET all users
     * @return List of all users
     */
    @GetMapping(value ="/users")
    public ResponseEntity<Object> getUsers() {
        if (!(userService.getAuthenticatedUser().getUserRole()==UserRole.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions. Admin level permissions are required.");
        }
        return ResponseEntity.status(HttpStatus.OK).body(userService.getAllUsers());
    }

    /**
     * Route to GET a specific user by its username
     * @param username
     * @return userx
     */
    @GetMapping(value="/users/{username}")
    public ResponseEntity<Object> getUserByUsername(@PathVariable(value = "username") String username) {
        Userx userx = userService.loadUserByUsername(username);

        // Return a 404 error if the User is not found
        if (userx == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with username: \"" + username + "\" not found.");
        }

        // Return a 403 error if a non-admin and not user itself tries to get User
        if (!userService.getAuthenticatedUser().getUserRole().equals(UserRole.ADMIN) || (userx.equals(userService.getAuthenticatedUser()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have access to this user.");
        }

        return ResponseEntity.status(HttpStatus.OK).body(userx);
    }

    /**
     * Route to GET all sensor stations gardeners are assigned to
     * @param username
     * @return List of assigned sensor stations
     */
    @GetMapping(value="/users/{username}/sensor-stations")
    public ResponseEntity<Object> getAssignedSS(@PathVariable(value = "username") String username) {
        Userx gardener = userService.loadUserByUsername(username);
        // Return a 404 error if the User is not found
        if (gardener == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with username: \"" + username + "\" not found.");
        }
        // Return a 403 error if a normal user tries to get list of assigned sensor-stations
        if (!(gardener.getUserRole().equals(UserRole.ADMIN) || gardener.getUserRole().equals(UserRole.GARDENER))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not a GARDENER, no sensor stations can be assigned to you.");
        }
        return ResponseEntity.status(HttpStatus.OK).body(userService.getAssignedSS(gardener));

    }
}
