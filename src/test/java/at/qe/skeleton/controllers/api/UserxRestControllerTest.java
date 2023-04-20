package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.Userx;
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
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

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
    Map<String, Object> jsonCreateUser = new HashMap<>();
    Map<String, Object> jsonUpdateUser = new HashMap<>();

    @BeforeEach
    void setUp() {
        username = "elvis";
        user = userService.loadUserByUsername("elvis");

        createUsername = "jsonUsername";
        jsonCreateUser.put("username", createUsername);
        jsonCreateUser.put("password", "secretPassword");
        jsonCreateUser.put("firstName", "first");
        jsonCreateUser.put("lastName", "last");

        jsonUpdateUser.put("password", "newPassword");
        jsonUpdateUser.put("firstName", "newFirst");
        jsonUpdateUser.put("lastName", "newLast");

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

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void createUser() {
        ResponseEntity response = this.userxRestController.createUser(jsonCreateUser);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertTrue(response.getBody() instanceof Userx);
        if (response.getBody() instanceof Userx){
            Assertions.assertEquals(createUsername, ((Userx) response.getBody()).getUsername());
        }
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

    @Test
    void updateUser() {
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedUpdateUser() {
        try {
            ResponseEntity response = this.userxRestController.updateUser(username, jsonCreateUser);
            Assertions.assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof AccessDeniedException);
        }
    }

    @Test
    void deleteUserByUsername() {
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

    @Test
    void getAssignedSS() {
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
}