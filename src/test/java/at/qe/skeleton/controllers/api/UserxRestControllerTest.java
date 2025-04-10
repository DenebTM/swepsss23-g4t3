package at.qe.skeleton.controllers.api;

import at.qe.skeleton.configs.WebSecurityConfig;
import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.ForbiddenException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.models.enums.UserRole;
import at.qe.skeleton.services.UserxService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@WebAppConfiguration
class UserxRestControllerTest {

    @Autowired
    private UserxService userService;
    @Autowired
    private UserxRestController userxRestController;

    Userx testUser;
    String testUsername;
    String testCreateUsername;
    String testCreatePassword;
    Map<String, Object> jsonCreateUser = new HashMap<>();
    Map<String, Object> jsonUpdateUser = new HashMap<>();

    @BeforeEach
    void setUp() {
        testUsername = "elvis";
        testUser = userService.loadUserByUsername("elvis");

        testCreateUsername = "jsonUsername";
        testCreatePassword = "secretPassword";
        jsonCreateUser.put(UserxRestController.JSON_KEY_USERNAME, testCreateUsername);
        jsonCreateUser.put(UserxRestController.JSON_KEY_PASSWORD, "secretPassword");
        jsonCreateUser.put(UserxRestController.JSON_KEY_FIRSTNAME, "first");
        jsonCreateUser.put(UserxRestController.JSON_KEY_LASTNAME, "last");

        jsonUpdateUser.put(UserxRestController.JSON_KEY_PASSWORD, "newPassword");
        jsonUpdateUser.put(UserxRestController.JSON_KEY_FIRSTNAME, "newFirst");
        jsonUpdateUser.put(UserxRestController.JSON_KEY_LASTNAME, "newLast");
        jsonUpdateUser.put(UserxRestController.JSON_KEY_USERROLE, "GARDENER");

    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetUsers() {
        int number = userService.getAllUsers().size();
        var response = userxRestController.getUsers();
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var users = response.getBody();
        assertNotNull(users);
        assertEquals(number, users.size());
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedGetUsers() {
        assertThrows(
            AccessDeniedException.class,
            () -> userxRestController.getUsers()
        );
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetUserByUsername() {
        var response = userxRestController.getUserByUsername(testUsername);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var user = response.getBody();
        assertNotNull(user);
        assertEquals(testUser, user);
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedGetUserByUsername() {
        assertThrows(
            AccessDeniedException.class,
            () -> userxRestController.getUserByUsername(testUsername)
        );
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testCreateUser() {
        var response = userxRestController.createUser(jsonCreateUser);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var user = response.getBody();
        assertNotNull(user);
        assertEquals(testCreateUsername, user.getUsername());
        assertTrue(WebSecurityConfig.passwordEncoder().matches(testCreatePassword, user.getPassword()));
        // default user role is USER
        assertEquals(UserRole.USER, user.getUserRole());

        // if username is already in use, 400 bad request error
        jsonCreateUser.replace(UserxRestController.JSON_KEY_USERNAME, testUsername);
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.createUser(jsonCreateUser)
        );

        // if username is not part of json body, 400 bad request error
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.createUser(jsonUpdateUser)
        );

        // if username is empty, 400 bad request error
        jsonCreateUser.replace(UserxRestController.JSON_KEY_USERNAME, "");
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.createUser(jsonCreateUser)
        );

        // if password is empty, 400 bad request error
        jsonCreateUser.replace(UserxRestController.JSON_KEY_USERNAME, testCreateUsername);
        jsonCreateUser.replace(UserxRestController.JSON_KEY_PASSWORD, "");
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.createUser(jsonCreateUser)
        );
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedCreateUser() {
        try {
            var response = userxRestController.createUser(jsonCreateUser);
            assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        } catch (Exception e) {
            assertTrue(e instanceof AccessDeniedException);
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testUpdateUser() {
        var response = userxRestController.updateUser(testUsername, jsonUpdateUser);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var user = response.getBody();
        assertNotNull(user);
        assertEquals((String)jsonUpdateUser.get(UserxRestController.JSON_KEY_FIRSTNAME), user.getFirstName());
        assertEquals((String)jsonUpdateUser.get(UserxRestController.JSON_KEY_LASTNAME), user.getLastName());
        assertEquals(UserRole.valueOf((String)jsonUpdateUser.get(UserxRestController.JSON_KEY_USERROLE)), user.getUserRole());
        assertTrue(WebSecurityConfig.passwordEncoder().matches((String)jsonUpdateUser.get(UserxRestController.JSON_KEY_PASSWORD), user.getPassword()));

        // if different username is part of json body, 400 bad request error
        jsonUpdateUser.put(UserxRestController.JSON_KEY_USERNAME, testUsername + "asdf");
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.updateUser(testUsername, jsonUpdateUser)
        );

        // if same username is part of json body, ok
        jsonUpdateUser.replace(UserxRestController.JSON_KEY_USERNAME, testUsername);
        assertDoesNotThrow(
            () -> userxRestController.updateUser(testUsername, jsonUpdateUser)
        );

        // if password is empty, 400 bad request error
        jsonUpdateUser.replace(UserxRestController.JSON_KEY_PASSWORD, "");
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.updateUser(testUsername, jsonUpdateUser)
        );

        // if username does not exist in database, 404 not found error
        assertThrows(
            NotFoundInDatabaseException.class,
            () -> userxRestController.updateUser("notExistingUsername", jsonUpdateUser)
        );
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testForbiddenChangeOwnRole() {
        jsonUpdateUser.put(UserxRestController.JSON_KEY_USERROLE, "GARDENER");
        assertThrows(
            ForbiddenException.class,
            () -> userxRestController.updateUser("admin", jsonUpdateUser)
        );
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedUpdateUser() {
        assertThrows(
            AccessDeniedException.class,
            () -> userxRestController.updateUser(testUsername, jsonUpdateUser)
        );
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testDeleteUserByUsername() {
        int originalSize = userService.getAllUsers().size();

        var response = userxRestController.deleteUserByUsername(testUsername);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(originalSize-1, userService.getAllUsers().size());

        // if username does not exist in database, 404 not found error
        assertThrows(
            NotFoundInDatabaseException.class,
            () -> userxRestController.deleteUserByUsername("notExistingUsername")
        );

        // if user tries to delete themselves, 403 forbidden error
        assertThrows(
            ForbiddenException.class,
            () -> userxRestController.deleteUserByUsername("admin")
        );
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedDeleteUser() {
        assertThrows(
            AccessDeniedException.class,
            () -> userxRestController.deleteUserByUsername(testUsername)
        );
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetAssignedSS() {
        var response = userxRestController.getAssignedSS(testUsername);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var sensorStations = response.getBody();
        assertNotNull(sensorStations);
        assertEquals(testUser.getAssignedSS().size(), sensorStations.size());

        // if username is not GARDENER or ADMIN, return empty ArrayList
        response = userxRestController.getAssignedSS("max");
        assertEquals(HttpStatus.OK, response.getStatusCode());

        sensorStations = response.getBody();
        assertNotNull(sensorStations);
        assertEquals(0, sensorStations.size());

        // if username does not exist in database, 404 not found error
        assertThrows(
            NotFoundInDatabaseException.class,
            () -> userxRestController.getAssignedSS("notExistingUsername")
        );
    }

    @Test
    @WithMockUser(username = "max", authorities = {"USER"})
    void testUnauthorizedGetAssignedSS() {
        assertThrows(
            AccessDeniedException.class,
            () -> userxRestController.getAssignedSS("max")
        );
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedGetAssignedSSOtherUser() {
        assertThrows(
            AccessDeniedException.class,
            () -> userxRestController.getAssignedSS("max")
        );
    }

}
