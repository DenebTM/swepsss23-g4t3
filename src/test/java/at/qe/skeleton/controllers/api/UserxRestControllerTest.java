package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.models.enums.Status;
import at.qe.skeleton.models.enums.UserRole;
import at.qe.skeleton.services.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@WebAppConfiguration
class UserxRestControllerTest {

    @Autowired
    private UserService userService;
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
        ResponseEntity response = this.userxRestController.getUsers();
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertEquals(number, ((Collection) response.getBody()).size());
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedGetUsers() {
        try {
            ResponseEntity response = this.userxRestController.getUsers();
            Assertions.assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof AccessDeniedException);
        }
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetUserByUsername() {
        ResponseEntity response = this.userxRestController.getUserByUsername(username);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertTrue(response.getBody() instanceof Userx);
        if (response.getBody() instanceof Userx){
            Assertions.assertEquals(username, ((Userx) response.getBody()).getUsername());
            Assertions.assertEquals(user.getFirstName(), ((Userx) response.getBody()).getFirstName());
            Assertions.assertEquals(user.getLastName(), ((Userx) response.getBody()).getLastName());
        }
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedGetUserByUsername() {
        try {
            ResponseEntity response = this.userxRestController.getUserByUsername(username);
            Assertions.assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof AccessDeniedException);
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testCreateUser() {
        ResponseEntity response = this.userxRestController.createUser(jsonCreateUser);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertTrue(response.getBody() instanceof Userx);
        if (response.getBody() instanceof Userx){
            Assertions.assertEquals(createUsername, ((Userx) response.getBody()).getUsername());
            Assertions.assertEquals(createPassword, ((Userx) response.getBody()).getPassword());
            // default user role is USER
            Assertions.assertEquals(UserRole.USER, ((Userx) response.getBody()).getUserRole());
        }
        // if username is already in use, 400 bad request error
        jsonCreateUser.replace("username", username);
        ResponseEntity response400 = this.userxRestController.createUser(jsonCreateUser);
        Assertions.assertEquals(HttpStatusCode.valueOf(400), response400.getStatusCode());
        // if username is not part of json body, 400 bad request error
        response400 = this.userxRestController.createUser(jsonUpdateUser);
        Assertions.assertEquals(HttpStatusCode.valueOf(400), response400.getStatusCode());
        // if username is empty, 400 bad request error
        jsonCreateUser.replace("username", "");
        response400 = this.userxRestController.createUser(jsonCreateUser);
        Assertions.assertEquals(HttpStatusCode.valueOf(400), response400.getStatusCode());
        jsonCreateUser.replace("username", createUsername);
        // if password is empty, 400 bad request error
        jsonCreateUser.replace("password", "");
        response400 = this.userxRestController.createUser(jsonCreateUser);
        Assertions.assertEquals(HttpStatusCode.valueOf(400), response400.getStatusCode());
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedCreateUser() {
        try {
            ResponseEntity response = this.userxRestController.createUser(jsonCreateUser);
            Assertions.assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof AccessDeniedException);
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testUpdateUser() {
        ResponseEntity response = this.userxRestController.updateUser(username, jsonUpdateUser);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertTrue(response.getBody() instanceof Userx);
        if (response.getBody() instanceof Userx){
            Assertions.assertEquals(username, ((Userx) response.getBody()).getUsername());
        }
        // if username is part of json body, 400 bad request error
        ResponseEntity response400 = this.userxRestController.updateUser(username, jsonCreateUser);
        Assertions.assertEquals(HttpStatusCode.valueOf(400), response400.getStatusCode());
        // if password is empty, 400 bad request error
        jsonUpdateUser.replace("password", "");
        response400 = this.userxRestController.updateUser(username, jsonUpdateUser);
        Assertions.assertEquals(HttpStatusCode.valueOf(400), response400.getStatusCode());
        // if username does not exist in database, 404 not found error
        ResponseEntity response404 = this.userxRestController.updateUser("notExistingUsername", jsonUpdateUser);
        Assertions.assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedUpdateUser() {
        try {
            ResponseEntity response = this.userxRestController.updateUser(username, jsonUpdateUser);
            Assertions.assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof AccessDeniedException);
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testDeleteUserByUsername() {
        int originalSize = userService.getAllUsers().size();
        ResponseEntity response404 = this.userxRestController.deleteUserByUsername("notExistingUsername");
        Assertions.assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
        ResponseEntity response403 = this.userxRestController.deleteUserByUsername("admin");
        Assertions.assertSame(HttpStatusCode.valueOf(403), response403.getStatusCode(), "Self deletion is permitted.");

        ResponseEntity response = this.userxRestController.deleteUserByUsername(username);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertEquals(originalSize-1, userService.getAllUsers().size());
        response404 = this.userxRestController.getUserByUsername(username);
        Assertions.assertSame(HttpStatusCode.valueOf(404), response404.getStatusCode(), "User is still found in database after being deleted.");
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedDeleteUser() {
        try {
            ResponseEntity response = this.userxRestController.deleteUserByUsername(username);
            Assertions.assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof AccessDeniedException);
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetAssignedSS() {
        ResponseEntity response = this.userxRestController.getAssignedSS(username);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertEquals(user.getAssignedSS().size(), ((Collection) response.getBody()).size());
        // if username is not GARDENER or ADMIN, return empty ArrayList
        response = this.userxRestController.getAssignedSS("max");
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertEquals(0, ((Collection<?>) response.getBody()).size());
        // if username does not exist in database, 404 not found error
        ResponseEntity response404 = this.userxRestController.getAssignedSS("notExistingUsername");
        Assertions.assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedGetAssignedSS() {
        try {
            ResponseEntity response = this.userxRestController.getAssignedSS(username);
            Assertions.assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof AccessDeniedException);
        }
    }
    @Test
    @WithMockUser(username = "max", authorities = {"USER"})
    void testUnauthorizedGetAssignedSSUser() {
        try {
            ResponseEntity response = this.userxRestController.getAssignedSS(username);
            Assertions.assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof AccessDeniedException);
        }
    }
}