package at.qe.skeleton.controllers.api;

import at.qe.skeleton.model.UserRole;
import at.qe.skeleton.model.Userx;
import at.qe.skeleton.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

@RestController
public class UserxRestController implements BaseRestController {

    @Autowired
    private UserService userService;

    private static final String USER_PATH = "/users";

    /**
     * Route to GET all users
     * @return List of all users
     */
    @GetMapping(value = USER_PATH)
    public ResponseEntity<Object> getUsers() {
        if (!(userService.authRoleIsAdmin())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions. Admin level permissions are required.");
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Route to GET a specific user by its username
     * @param username
     * @return userx
     */
    @GetMapping(value = USER_PATH +"/{username}")
    public ResponseEntity<Object> getUserByUsername(@PathVariable(value = "username") String username) {
        Userx userx = userService.loadUserByUsername(username);

        // Return a 404 error if the User is not found
        if (userx == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with username: \"" + username + "\" not found.");
        }

        // Return a 403 error if a non-admin and not user itself tries to get User
        if (!userService.authRoleIsAdmin() && !userx.equals(userService.getAuthenticatedUser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have access to this user.");
        }

       // return ResponseEntity.ok(userx);
        return ResponseEntity.status(HttpStatus.OK).body(userx);
    }

    /**
     * POST route to create a new user, only allowed by ADMIN
     * @param json body (username + password is required)
     * @return newly created user
     */
    @PostMapping(value ="/users")
    public ResponseEntity<Object> createUser(@RequestBody Map<String, Object> json) {
        if (!userService.authRoleIsAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions. Admin level permissions are required.");
        }

        String username = (String)json.get("username");
        if (username == null || username.equals("")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username cannot be blank.");
        }
        String password = (String)json.get("password");
        if (password == null || password.equals("")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password cannot be blank.");
        }
        Userx newUser = new Userx();
        newUser.setUsername(username);
        newUser.setUserRole(UserRole.USER); // role of new users is USER by default
        newUser = userService.saveUser(newUser);

        // hand setting the other parameters over to updateUser
        return updateUser(newUser.getId(), json);
    }




    /**
     * Route to GET all sensor stations gardeners are assigned to
     * @param username
     * @return List of assigned sensor stations
     */
    @GetMapping(value = USER_PATH +"/{username}/sensor-stations")
    public ResponseEntity<Object> getAssignedSS(@PathVariable(value = "username") String username) {
        Userx gardener = userService.loadUserByUsername(username);
        // Return a 403 error if a normal user tries to get list of assigned sensor stations
        if (userService.authRoleIsUser()){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions to view sensor stations assigned to a gardener.");
        }
        // Return a 404 error if the user is not found
        if (gardener == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with username: \"" + username + "\" not found.");
        }
        // Return a 403 error if a non admin tries to get list of assigned sensor stations for other users
        if (userService.authRoleIsGardener() && (!userService.getAuthenticatedUser().equals(gardener))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions to view sensor stations assigned to other gardeners.");
        }
        // Return [] if admin tries to get list of assigned sensor stations for normal users
        if (userService.roleIsUser(gardener)) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        return ResponseEntity.ok(userService.getAssignedSS(gardener));
    }





}
