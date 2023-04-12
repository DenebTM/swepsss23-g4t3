package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
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
    @Autowired
    private HelperFunctions helperFunctions;

    private static final String USER_PATH = "/users";
    private static final String USERNAME_PATH = USER_PATH + "/{username}";


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
    @GetMapping(value = USERNAME_PATH)
    public ResponseEntity<Object> getUserByUsername(@PathVariable(value = "username") String username) {
        Userx userx = userService.loadUserByUsername(username);

        // Return a 404 error if the User is not found
        if (userx == null) {
            return helperFunctions.notFoundError("User", username);
        }

        // Return a 403 error if a non-admin and not user itself tries to get User
        if (!userService.authRoleIsAdmin() && !userx.equals(userService.getAuthenticatedUser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have access to this user.");
        }

        return ResponseEntity.ok(userx);
    }

    /**
     * POST route to create a new user, only allowed by ADMIN
     * @param json body (username + password is required)
     * @return newly created user
     */
    @PostMapping(value = USER_PATH)
    public ResponseEntity<Object> createUser(@RequestBody Map<String, Object> json) {

        // return a 403 error if a non-admin wants to create a user
        if (!userService.authRoleIsAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions. Admin level permissions are required.");
        }
        // return a 400 error if the user gets created with empty username
        String username = (String)json.get("username");
        if (username == null || username.equals("")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username cannot be blank.");
        }
        // return a 400 error if the user gets created with an username already in use
        if (userService.loadUserByUsername(username)!=null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already in use. It must be unique.");
        }
        // return a 400 error if the user gets created with empty password
        String password = (String)json.get("password");
        if (userService.isNotValidPassword(password)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password cannot be blank.");
        }
        Userx newUser = new Userx();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setUserRole(UserRole.USER); // role of new users is USER by default
        if (json.containsKey("firstName")) {
            newUser.setFirstName((String)json.get("firstName"));
        }
        if (json.containsKey("lastName")) {
            newUser.setLastName((String)json.get("lastName"));
        }
        newUser = userService.saveUser(newUser);

        return ResponseEntity.ok(userService.saveUser(newUser));
    }

    /**
     * PUT route to update an already existing user, only allowed by ADMIN
     * @param username + json
     * @return updated user
     */
    @PutMapping (value = USERNAME_PATH)
    public ResponseEntity<Object> updateUser(@PathVariable(value = "username") String username, @RequestBody Map<String, Object> json) {
        Userx user = userService.loadUserByUsername(username);

        // return a 403 error if a non-admin wants to update another user
        if (!userService.authRoleIsAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions. Admin level permissions are required.");
        }
        // return a 404 error if the user to be updated does not exist
        if (user == null) {
            return helperFunctions.notFoundError("User", username);
        }
        // return a 400 error if the username is part of the json body, because it cannot be updated
        if (json.containsKey("username")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usernames are final and cannot be updated.");
        }

        // updating all fields mentioned in the json body
        if (json.containsKey("firstName")) {
            user.setFirstName((String)json.get("firstName"));
        }
        if (json.containsKey("lastName")) {
            user.setLastName((String)json.get("lastName"));
        }
        if (json.containsKey("password")) {
            String password = (String)json.get("password");
            if (userService.isNotValidPassword(password)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password cannot be blank.");
            }
//            String bcryptPassword = passwordEncoder.encode((String)json.get("password"));
            user.setPassword(password);
        }
        if (json.containsKey("userRole")) {
            try {
                user.setUserRole(UserRole.valueOf((String) json.get("userRole")));
            } catch (IllegalArgumentException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User role does not exist");
            }
        }
        return ResponseEntity.ok(userService.saveUser(user));
    }

    /**
     * DELETE route to delete a user by its username, only allowed by ADMIN
     * @param username
     * @return "Success."
     */
    @DeleteMapping(value = USERNAME_PATH)
    public ResponseEntity<Object> deleteUserByUsername(@PathVariable(value = "username") String username) {
        Userx user = userService.loadUserByUsername(username);

        // return a 403 error if a non-admin wants to delete a user
        if (!userService.authRoleIsAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions. Admin level permissions are required.");
        }
        // return a 404 error if the user to be deleted does not exist
        if (user == null) {
            return helperFunctions.notFoundError("User", username);
        }
        // return a 403 error if the authenticated user tries to delete themselves
        if (userService.getAuthenticatedUser().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Self-deletion is not permitted.");
        }
        userService.deleteUser(user);
        return ResponseEntity.ok(user);
    }

    /**
     * Route to GET all sensor stations gardeners are assigned to
     * @param username
     * @return List of assigned sensor stations
     */
    @GetMapping(value = USERNAME_PATH +"/sensor-stations")
    public ResponseEntity<Object> getAssignedSS(@PathVariable(value = "username") String username) {
        Userx gardener = userService.loadUserByUsername(username);
        // Return a 403 error if a normal user tries to get list of assigned sensor stations
        if (userService.authRoleIsUser()){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions to view sensor stations assigned to a gardener.");
        }
        // Return a 404 error if the user is not found
        if (gardener == null) {
            return helperFunctions.notFoundError("User", username);
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
