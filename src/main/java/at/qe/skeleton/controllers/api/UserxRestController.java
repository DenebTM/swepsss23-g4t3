package at.qe.skeleton.controllers.api;

import at.qe.skeleton.configs.WebSecurityConfig;
import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.ForbiddenException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.models.enums.UserRole;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.services.LoggingService;
import at.qe.skeleton.services.UserxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;

@RestController
public class UserxRestController implements BaseRestController {

    @Autowired
    private UserxService userService;

    @Autowired
    private LoggingService logger;

    private static final String USER_PATH = "/users";
    private static final String USERNAME_PATH = USER_PATH + "/{username}";

    // JSON keys used by PUT route
    public static final String JSON_KEY_PASSWORD = "password";
    public static final String JSON_KEY_FIRSTNAME = "firstName";
    public static final String JSON_KEY_LASTNAME = "lastName";
    public static final String JSON_KEY_USERNAME = "username";
    public static final String JSON_KEY_USERROLE = "userRole";

    /**
     * Route to GET all users
     * @return List of all users
     */

    @GetMapping(value = USER_PATH)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Collection<Userx>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Route to GET a specific user by its username
     * @param username
     * @return userx
     */
    @GetMapping(value = USERNAME_PATH)
    @PreAuthorize("hasAuthority('ADMIN') or principal eq #username")
    public ResponseEntity<Userx> getUserByUsername(@PathVariable(value = "username") String username) {
        // return a 404 error if the User is not found
        Userx userx = userService.loadUserByUsername(username);
        if (userx == null) {
            throw new NotFoundInDatabaseException("User", username);
        }

        return ResponseEntity.ok(userx);
    }

    /**
     * POST route to create a new user, only allowed by ADMIN
     * @param json body (username + password is required)
     * @return newly created user
     */
    @PostMapping(value = USER_PATH)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Userx> createUser(@RequestBody Map<String, Object> json) {
        String authenticatedUser = SecurityContextHolder.getContext().getAuthentication().getName();

        // return a 400 error if an empty username is given
        String username = String.valueOf(json.get(JSON_KEY_USERNAME));
        if (username.equals("null") || username.equals("")) {
            throw new BadRequestException("Username cannot be blank.");
        }
        // return a 400 error if a user with the same name already exists
        if (userService.loadUserByUsername(username) != null) {
            throw new BadRequestException("Username is already in use. It must be unique.");
        }
        // return a 400 error if an empty password is given
        String password = String.valueOf(json.get(JSON_KEY_PASSWORD));
        if (UserxService.isNotValidPassword(password)) {
            throw new BadRequestException("Password is not valid.");
        }

        Userx newUser = new Userx();
        newUser.setUsername(username);
        String bcryptPassword = WebSecurityConfig.passwordEncoder().encode(String.valueOf(json.get(JSON_KEY_PASSWORD)));
        newUser.setPassword(bcryptPassword);
        newUser.setUserRole(UserRole.USER); // role of new users is USER by default
        if (json.containsKey(JSON_KEY_FIRSTNAME)) {
            newUser.setFirstName(String.valueOf(json.get(JSON_KEY_FIRSTNAME)));
        }
        if (json.containsKey(JSON_KEY_LASTNAME)) {
            newUser.setLastName(String.valueOf(json.get(JSON_KEY_LASTNAME)));
        }
        newUser = userService.saveUser(newUser);

        logger.info("New user added by " + authenticatedUser, LogEntityType.USER, newUser.getUsername(), getClass());
        return ResponseEntity.ok(userService.saveUser(newUser));
    }

    /**
     * PUT route to update an existing user by name
     * @param username + json
     * @return updated user
     */
    @PutMapping(value = USERNAME_PATH)
    @PreAuthorize("hasAuthority('ADMIN') or principal eq #username")
    public ResponseEntity<Userx> updateUser(@PathVariable(value = "username") String username, @RequestBody Map<String, Object> json) {
        String authenticatedUser = SecurityContextHolder.getContext().getAuthentication().getName();

        // return a 404 error if the user to be updated does not exist
        Userx user = userService.loadUserByUsername(username);
        if (user == null) {
            throw new NotFoundInDatabaseException("User", username);
        }

        // return a 400 error if a username change is attempted
        if (json.containsKey(JSON_KEY_USERNAME) && !(String.valueOf(json.get(JSON_KEY_USERNAME))).equals(user.getUsername())) {
            throw new BadRequestException("Usernames are final and cannot be updated.");
        }

        // update all fields contained in the json body
        if (json.containsKey(JSON_KEY_FIRSTNAME)) {
            user.setFirstName(String.valueOf(json.get(JSON_KEY_FIRSTNAME)));
        }
        if (json.containsKey(JSON_KEY_LASTNAME)) {
            user.setLastName(String.valueOf(json.get(JSON_KEY_LASTNAME)));
        }
        if (json.containsKey(JSON_KEY_PASSWORD)) {
            String newPassword = String.valueOf(json.get(JSON_KEY_PASSWORD));
            if (UserxService.isNotValidPassword(newPassword)) {
                throw new BadRequestException("Password is not valid.");
            }
            String bcryptPassword = WebSecurityConfig.passwordEncoder().encode(newPassword);
            user.setPassword(bcryptPassword);
        }
        if (json.containsKey(JSON_KEY_USERROLE)) {
            try {
                UserRole newUserRole = UserRole.valueOf(String.valueOf(json.get(JSON_KEY_USERROLE)));

                // prevent users from promoting or demoting themselves
                if (user.getUsername().equals(authenticatedUser) && !newUserRole.equals(user.getUserRole())) {
                    throw new ForbiddenException("Cannot change own role");
                }

                user.setUserRole(newUserRole);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("User role does not exist.");
            }
        }

        logger.info("User updated by " + authenticatedUser, LogEntityType.USER, user.getUsername(), getClass());

        return ResponseEntity.ok(userService.saveUser(user));
    }

    /**
     * DELETE route to delete a user by name, only allowed by ADMIN
     * @param username
     * @return the deleted user
     */
    @DeleteMapping(value = USERNAME_PATH)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Userx> deleteUserByUsername(@PathVariable(value = "username") String username) {
        String authenticatedUser = SecurityContextHolder.getContext().getAuthentication().getName();

        // return a 404 error if the user to be deleted does not exist
        Userx user = userService.loadUserByUsername(username);
        if (user == null) {
            throw new NotFoundInDatabaseException("User", username);
        }
        // return a 403 error if the authenticated user tries to delete themselves
        if (userService.getAuthenticatedUser().getUsername().equals(username)) {
            throw new ForbiddenException("Self-deletion is not permitted.");
        }

        userService.deleteUser(user);
        logger.info("User deleted by " + authenticatedUser, LogEntityType.USER, user.getUsername(), getClass());

        return ResponseEntity.ok(user);
    }

    /**
     * Route to GET all sensor stations gardeners are assigned to
     * @param username
     * @return List of assigned sensor stations
     */
    @GetMapping(value = USERNAME_PATH +"/sensor-stations")
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('GARDENER') and principal eq #username)")
    public ResponseEntity<Collection<SensorStation>> getAssignedSS(@PathVariable(value = "username") String username) {
        // return a 404 error if the user is not found
        Userx gardener = userService.loadUserByUsername(username);
        if (gardener == null) {
            throw new NotFoundInDatabaseException("User", username);
        }

        // will return [] when trying to get assigned SS for normal users
        return ResponseEntity.ok(userService.getAssignedSS(gardener));
    }

}
