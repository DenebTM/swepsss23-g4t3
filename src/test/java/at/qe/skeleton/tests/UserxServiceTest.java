package at.qe.skeleton.tests;

import at.qe.skeleton.models.Userx;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import at.qe.skeleton.models.enums.UserRole;
import at.qe.skeleton.services.UserService;

/**
 * Some very basic tests for {@link UserService}.
 *
 * This class is part of the skeleton project provided for students of the
 * course "Software Engineering" offered by the University of Innsbruck.
 */
@SpringBootTest
@WebAppConfiguration
public class UserxServiceTest {

    @Autowired
    UserService userService;

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testDataInitialization() {
        Assertions.assertEquals(7, userService.getAllUsers().size(), "Insufficient amount of users initialized for test data source");
        for (Userx userx : userService.getAllUsers()) {
            if ("admin".equals(userx.getUsername())) {
                Assertions.assertSame(userx.getUserRole(), UserRole.ADMIN, "User \"" + userx + "\" does not have role ADMIN");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
                Assertions.assertNull(userx.getUpdateDate(), "User \"" + userx + "\" has a updateDate defined");
            } else if ("susi".equals(userx.getUsername())) {
                Assertions.assertSame(userx.getUserRole(), UserRole.GARDENER, "User \"" + userx + "\" does not have role GARDENER");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
                Assertions.assertNull(userx.getUpdateDate(), "User \"" + userx +"\" has a updateDate defined");
            } else if ("max".equals(userx.getUsername())) {
                Assertions.assertSame(userx.getUserRole(), UserRole.USER, "User \"" + userx + "\" does not have role USER");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
                Assertions.assertNull(userx.getUpdateDate(), "User \"" + userx + "\" has a updateDate defined");
            } else  if ("elvis".equals(userx.getUsername())) {
                Assertions.assertSame(userx.getUserRole(), UserRole.ADMIN, "User \"" + userx + "\" does not have role ADMIN");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
                Assertions.assertNull(userx.getUpdateDate(), "User \"" + userx + "\" has a updateDate defined");
            } else if ("hans".equals(userx.getUsername())) {
                Assertions.assertSame(userx.getUserRole(), UserRole.GARDENER, "User \"" + userx + "\" does not have role GARDENER");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
            } else if ("peter".equals(userx.getUsername())) {
                Assertions.assertSame(userx.getUserRole(), UserRole.GARDENER, "User \"" + userx + "\" does not have role GARDENER");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
            } else if ("franz".equals(userx.getUsername())) {
                Assertions.assertSame(userx.getUserRole(), UserRole.GARDENER, "User \"" + userx + "\" does not have role GARDENER");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
            }
            else {
                Assertions.fail("Unknown user \"" + userx.getUsername() + "\" loaded from test data source via UserService.getAllUsers");
            }
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testDeleteUser() {
        String username = "susi";
        Userx adminUserx = userService.loadUserByUsername("admin");
        Assertions.assertNotNull(adminUserx, "Admin user could not be loaded from test data source");
        Userx toBeDeletedUserx = userService.loadUserByUsername(username);
        Assertions.assertNotNull(toBeDeletedUserx, "User \"" + username + "\" could not be loaded from test data source");

        userService.deleteUser(toBeDeletedUserx);

        Assertions.assertEquals(6, userService.getAllUsers().size(), "No user has been deleted after calling UserService.deleteUser");
        Userx deletedUserx = userService.loadUserByUsername(username);
        Assertions.assertNull(deletedUserx, "Deleted User \"" + username + "\" could still be loaded from test data source via UserService.loadUser");

        for (Userx remainingUserx : userService.getAllUsers()) {
            Assertions.assertNotEquals(toBeDeletedUserx.getUsername(), remainingUserx.getUsername(), "Deleted User \"" + username + "\" could still be loaded from test data source via UserService.getAllUsers");
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testUpdateUser() {
        String username = "susi";
        Userx adminUserx = userService.loadUserByUsername("admin");
        Assertions.assertNotNull(adminUserx, "Admin user could not be loaded from test data source");
        Userx toBeSavedUserx = userService.loadUserByUsername(username);
        Assertions.assertNotNull(toBeSavedUserx, "User \"" + username + "\" could not be loaded from test data source");

        Assertions.assertNull(toBeSavedUserx.getUpdateDate(), "User \"" + username + "\" has a updateDate defined");

        toBeSavedUserx.setEmail("changed-email@whatever.wherever");
        userService.saveUser(toBeSavedUserx);

        Userx freshlyLoadedUserx = userService.loadUserByUsername(username);
        Assertions.assertNotNull(freshlyLoadedUserx, "User \"" + username + "\" could not be loaded from test data source after being saved");
        Assertions.assertNotNull(freshlyLoadedUserx.getUpdateDate(), "User \"" + username + "\" does not have a updateDate defined after being saved");
        Assertions.assertEquals("changed-email@whatever.wherever", freshlyLoadedUserx.getEmail(), "User \"" + username + "\" does not have a the correct email attribute stored being saved");
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testCreateUser() {
        Userx adminUserx = userService.loadUserByUsername("admin");
        Assertions.assertNotNull(adminUserx, "Admin user could not be loaded from test data source");

        String username = "newuser";
        String password = "passwd";
        String fName = "New";
        String lName = "User";
        String email = "new-email@whatever.wherever";
        Userx toBeCreatedUserx = new Userx();
        toBeCreatedUserx.setUsername(username);
        toBeCreatedUserx.setPassword(password);
        toBeCreatedUserx.setFirstName(fName);
        toBeCreatedUserx.setLastName(lName);
        toBeCreatedUserx.setEmail(email);
        toBeCreatedUserx.setUserRole(UserRole.GARDENER);
        userService.saveUser(toBeCreatedUserx);

        Userx freshlyCreatedUserx = userService.loadUserByUsername(username);
        Assertions.assertNotNull(freshlyCreatedUserx, "New user could not be loaded from test data source after being saved");
        Assertions.assertEquals(username, freshlyCreatedUserx.getUsername(), "New user could not be loaded from test data source after being saved");
        Assertions.assertEquals(password, freshlyCreatedUserx.getPassword(), "User \"" + username + "\" does not have a the correct password attribute stored being saved");
        Assertions.assertEquals(fName, freshlyCreatedUserx.getFirstName(), "User \"" + username + "\" does not have a the correct firstName attribute stored being saved");
        Assertions.assertEquals(lName, freshlyCreatedUserx.getLastName(), "User \"" + username + "\" does not have a the correct lastName attribute stored being saved");
        Assertions.assertEquals(email, freshlyCreatedUserx.getEmail(), "User \"" + username + "\" does not have a the correct email attribute stored being saved");
        Assertions.assertSame(freshlyCreatedUserx.getUserRole(), UserRole.GARDENER, "User \"" + username + "\" does not have role GARDENER");
        Assertions.assertNotNull(freshlyCreatedUserx.getCreateDate(), "User \"" + username + "\" does not have a createDate defined after being saved");
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testExceptionForEmptyUsername() {
        Assertions.assertThrows(org.springframework.orm.jpa.JpaSystemException.class, () -> {
            Userx adminUserx = userService.loadUserByUsername("admin");
            Assertions.assertNotNull(adminUserx, "Admin user could not be loaded from test data source");

            Userx toBeCreatedUserx = new Userx();
            userService.saveUser(toBeCreatedUserx);
        });
    }

    @Test
    public void testUnauthenticatedLoadUsers() {
        Assertions.assertThrows(org.springframework.security.authentication.AuthenticationCredentialsNotFoundException.class, () -> {
            for (Userx userx : userService.getAllUsers()) {
                Assertions.fail("Call to userService.getAllUsers should not work without proper authorization");
            }
        });
    }

    @Test
    @WithMockUser(username = "user", authorities = {"USER"})
    public void testUnauthorizedLoadUsers() {
        Assertions.assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            for (Userx userx : userService.getAllUsers()) {
                Assertions.fail("Call to userService.getAllUsers should not work without proper authorization");
            }
        });
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"USER"})
    public void testAuthorizedLoadUser() {
        String username = "susi";
        Userx userx = userService.loadUserByUsername(username);
        Assertions.assertEquals(username, userx.getUsername(), "Call to userService.loadUser returned wrong user");
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"USER"})
    public void testUnauthorizedSaveUser() {
        Assertions.assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            String username = "susi";
            Userx userx = userService.loadUserByUsername(username);
            Assertions.assertEquals(username, userx.getUsername(), "Call to userService.loadUser returned wrong user");
            userService.saveUser(userx);
        });
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"USER"})
    public void testUnauthorizedDeleteUser() {
        Assertions.assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            Userx userx = userService.loadUserByUsername("susi");
            Assertions.assertEquals("susi", userx.getUsername(), "Call to userService.loadUser returned wrong user");
            userService.deleteUser(userx);
        });
    }

}