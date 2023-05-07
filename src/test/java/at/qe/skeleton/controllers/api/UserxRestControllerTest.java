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
    private UserxService userService;
    @Autowired
    private UserxRestController userxRestController;

    Userx user;
    String username;
    String createUsername;
    String createPassword;
    Map<String, Object> jsonCreateUser = new HashMap<>();
    Map<String, Object> jsonUpdateUser = new HashMap<>();

    @BeforeEach
    void setUp() {
        username = "elvis";
        user = userService.loadUserByUsername("elvis");

        createUsername = "jsonUsername";
        createPassword = "secretPassword";
        jsonCreateUser.put("username", createUsername);
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
        assertEquals(number, response.getBody().size());
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedGetUsers() {
        try {
            var response = userxRestController.getUsers();
            assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            assertTrue(e instanceof AccessDeniedException);
        }
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetUserByUsername() {
        var response = userxRestController.getUserByUsername(username);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertTrue(response.getBody() instanceof Userx);
        if (response.getBody() instanceof Userx){
            assertEquals(username, ((Userx) response.getBody()).getUsername());
            assertEquals(user.getFirstName(), ((Userx) response.getBody()).getFirstName());
            assertEquals(user.getLastName(), ((Userx) response.getBody()).getLastName());
        }
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedGetUserByUsername() {
        try {
            var response = userxRestController.getUserByUsername(username);
            assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            assertTrue(e instanceof AccessDeniedException);
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testCreateUser() {
        var response = userxRestController.createUser(jsonCreateUser);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertTrue(response.getBody() instanceof Userx);
        if (response.getBody() instanceof Userx){
            assertEquals(createUsername, ((Userx) response.getBody()).getUsername());
            assertTrue(WebSecurityConfig.passwordEncoder().matches(createPassword, ((Userx) response.getBody()).getPassword()));
            // default user role is USER
            assertEquals(UserRole.USER, ((Userx) response.getBody()).getUserRole());
        }

        // if username is already in use, 400 bad request error
        jsonCreateUser.replace("username", username);
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
        jsonCreateUser.replace("username", createUsername);
        jsonCreateUser.replace("password", "");
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
            assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            assertTrue(e instanceof AccessDeniedException);
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testUpdateUser() {
        var response = userxRestController.updateUser(username, jsonUpdateUser);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertTrue(response.getBody() instanceof Userx);
        if (response.getBody() instanceof Userx){
            assertEquals(username, ((Userx) response.getBody()).getUsername());
        }

        // if username is part of json body, 400 bad request error
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.updateUser(username, jsonCreateUser)
        );

        // if password is empty, 400 bad request error
        jsonUpdateUser.replace("password", "");
        assertThrows(
            BadRequestException.class,
            () -> userxRestController.updateUser(username, jsonCreateUser)
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
        try {
            var response = userxRestController.updateUser(username, jsonUpdateUser);
            assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            assertTrue(e instanceof AccessDeniedException);
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testDeleteUserByUsername() {
        int originalSize = userService.getAllUsers().size();

        var response = userxRestController.deleteUserByUsername(username);
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
            () -> userxRestController.deleteUserByUsername(username)
        );
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetAssignedSS() {
        var response = userxRestController.getAssignedSS(username);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(user.getAssignedSS().size(), response.getBody().size());

        // if username is not GARDENER or ADMIN, return empty ArrayList
        response = userxRestController.getAssignedSS("max");
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(0, response.getBody().size());

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
