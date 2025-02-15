package at.qe.skeleton.services;

import at.qe.skeleton.models.enums.UserRole;
import at.qe.skeleton.models.Userx;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Some very basic tests for {@link UserxService}.
 *
 * This class is part of the skeleton project provided for students of the
 * course "Software Engineering" offered by the University of Innsbruck.
 */
@SpringBootTest
@WebAppConfiguration
public class UserxServiceTest {

    @Autowired
    UserxService userService;

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testDeleteUser() {
        int initialUserCount = userService.getAllUsers().size();
        String username = "susi";
        Userx adminUserx = userService.loadUserByUsername("admin");
        assertNotNull(adminUserx, "Admin user could not be loaded from test data source");
        Userx toBeDeletedUserx = userService.loadUserByUsername(username);
        assertNotNull(toBeDeletedUserx, "User \"" + username + "\" could not be loaded from test data source");
        userService.deleteUser(toBeDeletedUserx);

        assertEquals(initialUserCount - 1, userService.getAllUsers().size(), "No user has been deleted after calling UserService.deleteUser");
        Userx deletedUserx = userService.loadUserByUsername(username);
        assertNull(deletedUserx, "Deleted User \"" + username + "\" could still be loaded from test data source via UserService.loadUser");

        for (Userx remainingUserx : userService.getAllUsers()) {
            assertNotEquals(toBeDeletedUserx.getUsername(), remainingUserx.getUsername(), "Deleted User \"" + username + "\" could still be loaded from test data source via UserService.getAllUsers");
        }
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testUpdateUser() {
        String username = "susi";
        Userx toBeSavedUserx = userService.loadUserByUsername(username);
        assertNotNull(toBeSavedUserx, "User \"" + username + "\" could not be loaded from test data source");
        
        var initialUpdateDate = toBeSavedUserx.getUpdateDate();

        toBeSavedUserx.setEmail("changed-email@whatever.wherever");
        userService.saveUser(toBeSavedUserx);

        Userx freshlyLoadedUserx = userService.loadUserByUsername(username);
        assertNotNull(freshlyLoadedUserx, "User \"" + username + "\" could not be loaded from test data source after being saved");
        assertEquals("changed-email@whatever.wherever", freshlyLoadedUserx.getEmail(), "User \"" + username + "\" does not have a the correct email attribute stored being saved");

        assertTrue(freshlyLoadedUserx.getUpdateDate().isAfter(initialUpdateDate), "Update date for \"" + username + "\" did not change after being saved");
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testCreateUser() {
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
        assertNotNull(freshlyCreatedUserx, "New user could not be loaded from test data source after being saved");
        assertEquals(username, freshlyCreatedUserx.getUsername(), "New user could not be loaded from test data source after being saved");
        assertEquals(password, freshlyCreatedUserx.getPassword(), "User \"" + username + "\" does not have a the correct password attribute stored being saved");
        assertEquals(fName, freshlyCreatedUserx.getFirstName(), "User \"" + username + "\" does not have a the correct firstName attribute stored being saved");
        assertEquals(lName, freshlyCreatedUserx.getLastName(), "User \"" + username + "\" does not have a the correct lastName attribute stored being saved");
        assertEquals(email, freshlyCreatedUserx.getEmail(), "User \"" + username + "\" does not have a the correct email attribute stored being saved");
        assertSame(freshlyCreatedUserx.getUserRole(), UserRole.GARDENER, "User \"" + username + "\" does not have role GARDENER");
        assertNotNull(freshlyCreatedUserx.getCreateDate(), "User \"" + username + "\" does not have a createDate defined after being saved");
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testExceptionForEmptyUsername() {
        assertThrows(org.springframework.orm.jpa.JpaSystemException.class, () -> {
            Userx adminUserx = userService.loadUserByUsername("admin");
            assertNotNull(adminUserx, "Admin user could not be loaded from test data source");

            Userx toBeCreatedUserx = new Userx();
            userService.saveUser(toBeCreatedUserx);
        });
    }

    @Test
    public void testUnauthenticatedLoadUsers() {
        assertThrows(
            AuthenticationCredentialsNotFoundException.class,
            () -> userService.getAllUsers(),
            "Call to userService.getAllUsers should not work without proper authorization"
        );
    }

    @Test
    @WithMockUser(username = "user", authorities = {"USER"})
    public void testUnauthorizedLoadUsers() {
        assertThrows(
            AccessDeniedException.class,
            () -> userService.getAllUsers(),
            "Call to userService.getAllUsers should not work without proper authorization"
        );
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"USER"})
    public void testAuthorizedLoadUser() {
        String username = "susi";
        Userx userx = userService.loadUserByUsername(username);
        assertEquals(username, userx.getUsername(), "Call to userService.loadUser returned wrong user");
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"USER"})
    public void testUnauthorizedSaveUser() {
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            String username = "susi";
            Userx userx = userService.loadUserByUsername(username);
            assertEquals(username, userx.getUsername(), "Call to userService.loadUser returned wrong user");
            userService.saveUser(userx);
        });
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"USER"})
    public void testUnauthorizedDeleteUser() {
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            Userx userx = userService.loadUserByUsername("susi");
            assertEquals("susi", userx.getUsername(), "Call to userService.loadUser returned wrong user");
            userService.deleteUser(userx);
        });
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testRoleIsUser() {
        assertTrue(userService.roleIsUser(userService.loadUserByUsername("max")));
        assertFalse(userService.roleIsUser(userService.loadUserByUsername("susi")));
    }
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void testAuthRoleIsAdmin() {
        assertTrue(userService.authRoleIsAdmin());
        assertFalse(userService.authRoleIsUser());
        assertFalse(userService.authRoleIsGardener());
    }
    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    public void testAuthRoleIsGardener() {
        assertTrue(userService.authRoleIsGardener());
        assertFalse(userService.authRoleIsAdmin());
    }
    @Test
    @WithMockUser(username = "max", authorities = {"USER"})
    public void testAuthRoleIsUser() {
        assertTrue(userService.authRoleIsUser());
    }

    @Test
    public void testIsNotValidPassword() {
        assertTrue(UserxService.isNotValidPassword(""));
        assertTrue(UserxService.isNotValidPassword("null"));
        assertTrue(UserxService.isNotValidPassword(null));
        assertFalse(UserxService.isNotValidPassword("validPassword"));
    }

}
