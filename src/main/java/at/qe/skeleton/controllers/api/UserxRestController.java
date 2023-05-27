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

    private static final String PW = "password",
                                FN = "firstName",
                                LN = "lastName",
                                UN = "username",
                                UR = "userRole";
    private static final String USER_PATH = "/users",
                                USERNAME_PATH = USER_PATH + "/{username}";

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
        Userx userx = userService.loadUserByUsername(username);

        // Return a 404 error if the User is not found
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

        // return a 400 error if the user gets created with empty username
        String username = (String)json.get("username");
        if (username == null || username.equals("")) {
            throw new BadRequestException("Username cannot be blank.");
        }
        // return a 400 error if the user gets created with an username already in use
        if (userService.loadUserByUsername(username)!=null) {
            throw new BadRequestException("Username is already in use. It must be unique.");
        }
        // return a 400 error if the user gets created with empty password
        String password = (String)json.get(PW);
        if (userService.isNotValidPassword(password)) {
            throw new BadRequestException("Password is not valid.");
        }

        Userx newUser = new Userx();
        newUser.setUsername(username);
        String bcryptPassword = WebSecurityConfig.passwordEncoder().encode((String)json.get("password"));
        newUser.setPassword(bcryptPassword);
        newUser.setUserRole(UserRole.USER); // role of new users is USER by default
        if (json.containsKey(FN)) {
            newUser.setFirstName((String)json.get(FN));
        }
        if (json.containsKey(LN)) {
            newUser.setLastName((String)json.get(LN));
        }
        newUser = userService.saveUser(newUser);

        logger.info("New user added by " + authenticatedUser, LogEntityType.USER, newUser.getUsername(), getClass());
        return ResponseEntity.ok(userService.saveUser(newUser));
    }

    /**
     * PUT route to update an existing user
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
        if (json.containsKey(UN) && !((String)json.get(UN)).equals(user.getUsername())) {
            throw new BadRequestException("Usernames are final and cannot be updated.");
        }

        // update all fields contained in the json body
        if (json.containsKey(FN)) {
            user.setFirstName((String)json.get(FN));
        }
        if (json.containsKey(LN)) {
            user.setLastName((String)json.get(LN));
        }
        if (json.containsKey(PW)) {
            String newPassword = (String)json.get(PW);
            if (userService.isNotValidPassword(newPassword)) {
                throw new BadRequestException("Password is not valid.");
            }
            String bcryptPassword = WebSecurityConfig.passwordEncoder().encode(newPassword);
            user.setPassword(bcryptPassword);
        }
        if (json.containsKey(UR)) {
            try {
                UserRole newUserRole = UserRole.valueOf((String)json.get(UR));

                // prevent users from promoting or demoting themselves
                if (user.getUsername().equals(authenticatedUser) && !newUserRole.equals(user.getUserRole())) {
                    throw new ForbiddenException("Cannot change own role");
                }

                user.setUserRole(newUserRole);
            } catch (IllegalArgumentException e){
                throw new BadRequestException("User role does not exist.");
            }
        }

        logger.info("User updated by " + authenticatedUser, LogEntityType.USER, user.getUsername(), getClass());

        return ResponseEntity.ok(userService.saveUser(user));
    }

    /**
     * DELETE route to delete a user by its username, only allowed by ADMIN
     * @param username
     * @return the deleted user
     */
    @DeleteMapping(value = USERNAME_PATH)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Userx> deleteUserByUsername(@PathVariable(value = "username") String username) {
        String authenticatedUser = SecurityContextHolder.getContext().getAuthentication().getName();

        Userx user = userService.loadUserByUsername(username);
        // return a 404 error if the user to be deleted does not exist
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
        Userx gardener = userService.loadUserByUsername(username);
        // Return a 404 error if the user is not found
        if (gardener == null) {
            throw new NotFoundInDatabaseException("User", username);
        }
        // Will return [] when trying to get assigned SS for normal users
        return ResponseEntity.ok(userService.getAssignedSS(gardener));
    }
}
