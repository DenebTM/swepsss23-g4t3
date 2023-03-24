package at.qe.skeleton.tests;

import at.qe.skeleton.model.Userx;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.internal.util.collections.Sets;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import at.qe.skeleton.model.UserRole;
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
    public void testDatainitialization() {
        Assertions.assertEquals(4, userService.getAllUsers().size(), "Insufficient amount of users initialized for test data source");
        for (Userx userx : userService.getAllUsers()) {
            if ("admin".equals(userx.getUsername())) {
                Assertions.assertTrue(userx.getRoles().contains(UserRole.ADMIN), "User \"" + userx + "\" does not have role ADMIN");
                Assertions.assertNotNull(userx.getCreateUser(), "User \"" + userx + "\" does not have a createUser defined");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
                Assertions.assertNull(userx.getUpdateUser(), "User \"" + userx + "\" has a updateUser defined");
                Assertions.assertNull(userx.getUpdateDate(), "User \"" + userx + "\" has a updateDate defined");
            } else if ("user1".equals(userx.getUsername())) {
                Assertions.assertTrue(userx.getRoles().contains(UserRole.GARDENER), "User \"" + userx + "\" does not have role GARDENER");
                Assertions.assertNotNull(userx.getCreateUser(), "User \"" + userx + "\" does not have a createUser defined");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
                Assertions.assertNull(userx.getUpdateUser(), "User \"" + userx + "\" has a updateUser defined");
                Assertions.assertNull(userx.getUpdateDate(), "User \"" + userx +"\" has a updateDate defined");
            } else if ("user2".equals(userx.getUsername())) {
                Assertions.assertTrue(userx.getRoles().contains(UserRole.USER), "User \"" + userx + "\" does not have role USER");
                Assertions.assertNotNull(userx.getCreateUser(), "User \"" + userx + "\" does not have a createUser defined");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
                Assertions.assertNull(userx.getUpdateUser(), "User \"" + userx + "\" has a updateUser defined");
                Assertions.assertNull(userx.getUpdateDate(), "User \"" + userx + "\" has a updateDate defined");
            } else  if ("elvis".equals(userx.getUsername())) {
                Assertions.assertTrue(userx.getRoles().contains(UserRole.ADMIN), "User \"" + userx + "\" does not have role ADMIN");
                Assertions.assertNotNull(userx.getCreateUser(), "User \"" + userx + "\" does not have a createUser defined");
                Assertions.assertNotNull(userx.getCreateDate(), "User \"" + userx + "\" does not have a createDate defined");
                Assertions.assertNull(userx.getUpdateUser(), "User \"" + userx + "\" has a updateUser defined");
                Assertions.assertNull(userx.getUpdateDate(), "User \"" + userx + "\" has a updateDate defined");
            } else {
                Assertions.fail("Unknown user \"" + userx.getUsername() + "\" loaded from test data source via UserService.getAllUsers");
            }
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testDeleteUser() {
        String email = "susi@example.at";
        Userx adminUserx = userService.loadUserByEmail("admin@example.at");
        Assertions.assertNotNull(adminUserx, "Admin user could not be loaded from test data source");
        Userx toBeDeletedUserx = userService.loadUserByEmail(email);
        Assertions.assertNotNull(toBeDeletedUserx, "User \"" + email + "\" could not be loaded from test data source");

        userService.deleteUser(toBeDeletedUserx);

        Assertions.assertEquals(3, userService.getAllUsers().size(), "No user has been deleted after calling UserService.deleteUser");
        Userx deletedUserx = userService.loadUserByEmail(email);
        Assertions.assertNull(deletedUserx, "Deleted User \"" + email + "\" could still be loaded from test data source via UserService.loadUser");

        for (Userx remainingUserx : userService.getAllUsers()) {
            Assertions.assertNotEquals(toBeDeletedUserx.getUsername(), remainingUserx.getUsername(), "Deleted User \"" + email + "\" could still be loaded from test data source via UserService.getAllUsers");
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testUpdateUser() {
        String email = "susi@example.at";
        Userx adminUserx = userService.loadUserByEmail("admin@example.at");
        Assertions.assertNotNull(adminUserx, "Admin user could not be loaded from test data source");
        Userx toBeSavedUserx = userService.loadUserByEmail(email);
        Assertions.assertNotNull(toBeSavedUserx, "User \"" + email + "\" could not be loaded from test data source");

        Assertions.assertNull(toBeSavedUserx.getUpdateUser(), "User \"" + email + "\" has a updateUser defined");
        Assertions.assertNull(toBeSavedUserx.getUpdateDate(), "User \"" + email + "\" has a updateDate defined");

        toBeSavedUserx.setEmail("changed-email@whatever.wherever");
        userService.saveUser(toBeSavedUserx);

        Userx freshlyLoadedUserx = userService.loadUserByEmail("susi@example.at");
        Assertions.assertNotNull(freshlyLoadedUserx, "User \"" + email + "\" could not be loaded from test data source after being saved");
        Assertions.assertNotNull(freshlyLoadedUserx.getUpdateUser(), "User \"" + email + "\" does not have a updateUser defined after being saved");
        Assertions.assertEquals(adminUserx, freshlyLoadedUserx.getUpdateUser(), "User \"" + email + "\" has wrong updateUser set");
        Assertions.assertNotNull(freshlyLoadedUserx.getUpdateDate(), "User \"" + email + "\" does not have a updateDate defined after being saved");
        Assertions.assertEquals("changed-email@whatever.wherever", freshlyLoadedUserx.getEmail(), "User \"" + email + "\" does not have a the correct email attribute stored being saved");
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testCreateUser() {
        Userx adminUserx = userService.loadUserByEmail("admin@example.at");
        Assertions.assertNotNull(adminUserx, "Admin user could not be loaded from test data source");

        String username = "newuser";
        String password = "passwd";
        String fName = "New";
        String lName = "User";
        String email = "new-email@whatever.wherever";
        String phone = "+12 345 67890";
        Userx toBeCreatedUserx = new Userx();
        toBeCreatedUserx.setUsername(username);
        toBeCreatedUserx.setPassword(password);
        toBeCreatedUserx.setFirstName(fName);
        toBeCreatedUserx.setLastName(lName);
        toBeCreatedUserx.setEmail(email);
        toBeCreatedUserx.setRoles(Sets.newSet(UserRole.USER, UserRole.GARDENER));
        userService.saveUser(toBeCreatedUserx);

        Userx freshlyCreatedUserx = userService.loadUserByEmail(email);
        Assertions.assertNotNull(freshlyCreatedUserx, "New user could not be loaded from test data source after being saved");
        Assertions.assertEquals(username, freshlyCreatedUserx.getUsername(), "New user could not be loaded from test data source after being saved");
        Assertions.assertEquals(password, freshlyCreatedUserx.getPassword(), "User \"" + username + "\" does not have a the correct password attribute stored being saved");
        Assertions.assertEquals(fName, freshlyCreatedUserx.getFirstName(), "User \"" + username + "\" does not have a the correct firstName attribute stored being saved");
        Assertions.assertEquals(lName, freshlyCreatedUserx.getLastName(), "User \"" + username + "\" does not have a the correct lastName attribute stored being saved");
        Assertions.assertEquals(email, freshlyCreatedUserx.getEmail(), "User \"" + username + "\" does not have a the correct email attribute stored being saved");
        Assertions.assertTrue(freshlyCreatedUserx.getRoles().contains(UserRole.GARDENER), "User \"" + username + "\" does not have role GARDENER");
        Assertions.assertTrue(freshlyCreatedUserx.getRoles().contains(UserRole.USER), "User \"" + username + "\" does not have role USER");
        Assertions.assertNotNull(freshlyCreatedUserx.getCreateUser(), "User \"" + username + "\" does not have a createUser defined after being saved");
        Assertions.assertEquals(adminUserx, freshlyCreatedUserx.getCreateUser(), "User \"" + username + "\" has wrong createUser set");
        Assertions.assertNotNull(freshlyCreatedUserx.getCreateDate(), "User \"" + username + "\" does not have a createDate defined after being saved");
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testExceptionForEmptyUsername() {
        Assertions.assertThrows(org.springframework.orm.jpa.JpaSystemException.class, () -> {
            Userx adminUserx = userService.loadUserByEmail("admin@example.at");
            Assertions.assertNotNull(adminUserx, "Admin user could not be loaded from test data source");

            Userx toBeCreatedUserx = new Userx();
            userService.saveUser(toBeCreatedUserx);
        });
    }

    @Test
    public void testUnauthenticateddLoadUsers() {
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
    @WithMockUser(username = "user1", authorities = {"USER"})
    public void testUnauthorizedLoadUser() {
        Assertions.assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            Userx userx = userService.loadUserByEmail("admin@example.at");
            Assertions.fail("Call to userService.loadUser should not work without proper authorization for other users than the authenticated one");
        });
    }

    @WithMockUser(username = "user1", authorities = {"USER"})
    public void testAuthorizedLoadUser() {
        String email = "susi@example.at";
        Userx userx = userService.loadUserByEmail(email);
        Assertions.assertEquals(email, userx.getUsername(), "Call to userService.loadUser returned wrong user");
    }

    @Test
    @WithMockUser(username = "user1", authorities = {"USER"})
    public void testUnauthorizedSaveUser() {
        Assertions.assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            String email = "susi@example.at";
            Userx userx = userService.loadUserByEmail(email);
            Assertions.assertEquals(email, userx.getEmail(), "Call to userService.loadUser returned wrong user");
            userService.saveUser(userx);
        });
    }

    @Test
    @WithMockUser(username = "user1", authorities = {"USER"})
    public void testUnauthorizedDeleteUser() {
        Assertions.assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            Userx userx = userService.loadUserByEmail("susi@example.at");
            Assertions.assertEquals("user1", userx.getUsername(), "Call to userService.loadUser returned wrong user");
            userService.deleteUser(userx);
        });
    }

}