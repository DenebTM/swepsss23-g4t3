package at.qe.skeleton.controllers.api;

import at.qe.skeleton.configs.WebSecurityConfig;
import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.ForbiddenException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.models.enums.UserRole;
import at.qe.skeleton.repositories.UserxRepository;
import at.qe.skeleton.services.UserxService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
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
    private UserxRepository userRepository;
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
        jsonCreateUser.put("username", testCreateUsername);
        jsonCreateUser.put("password", "secretPassword");
        jsonCreateUser.put("firstName", "first");
        jsonCreateUser.put("lastName", "last");

        jsonUpdateUser.put("password", "newPassword");
        jsonUpdateUser.put("firstName", "newFirst");
        jsonUpdateUser.put("lastName", "newLast");
        jsonUpdateUser.put("userRole", "GARDENER");

    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetUsers() {
        int number = userService.getAllUsers().size();
        var response = userxRestController.getUsers();
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

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
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

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
        // remove the user first to avoid a naming conflict
        userRepository.removeByUsername((String)jsonCreateUser.get("username"));
        
        var response = userxRestController.createUser(jsonCreateUser);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var user = response.getBody();
        assertNotNull(user);
        assertEquals(testCreateUsername, user.getUsername());
        assertTrue(WebSecurityConfig.passwordEncoder().matches(testCreatePassword, user.getPassword()));
        // default user role is USER
        assertEquals(UserRole.USER, user.getUserRole());

        // if username is already in use, 400 bad request error
        jsonCreateUser.replace("username", testUsername);
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
        jsonCreateUser.replace("username", "");
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.createUser(jsonCreateUser)
        );

        // if password is empty, 400 bad request error
        jsonCreateUser.replace("username", testCreateUsername);
        jsonCreateUser.replace("password", "");
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.createUser(jsonCreateUser)
        );

        // remove the created user again
        userRepository.delete(user);
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedCreateUser() {
        try {
            var response = userxRestController.createUser(jsonCreateUser);
            assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            assertTrue(e instanceof AccessDeniedException);
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testUpdateUser() {
        var response = userxRestController.updateUser(testUsername, jsonUpdateUser);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var user = response.getBody();
        assertNotNull(user);
        assertEquals((String)jsonUpdateUser.get("firstName"), user.getFirstName());
        assertEquals((String)jsonUpdateUser.get("lastName"), user.getLastName());
        assertEquals(UserRole.valueOf((String)jsonUpdateUser.get("userRole")), user.getUserRole());
        assertTrue(WebSecurityConfig.passwordEncoder().matches((String)jsonUpdateUser.get("password"), user.getPassword()));

        // if username is part of json body, 400 bad request error
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.updateUser(testUsername, jsonCreateUser)
        );

        // if password is empty, 400 bad request error
        jsonUpdateUser.replace("password", "");
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.updateUser(testUsername, jsonCreateUser)
        );

        // if username does not exist in database, 404 not found error
        assertThrows(
            NotFoundInDatabaseException.class,
            () -> userxRestController.updateUser("notExistingUsername", jsonCreateUser)
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
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
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
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var sensorStations = response.getBody();
        assertNotNull(sensorStations);
        assertEquals(testUser.getAssignedSS().size(), sensorStations.size());

        // if username is not GARDENER or ADMIN, return empty ArrayList
        response = userxRestController.getAssignedSS("max");
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

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
