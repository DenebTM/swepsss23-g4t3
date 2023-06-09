package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.enums.AccessPointStatus;
import at.qe.skeleton.services.AccessPointService;
import jakarta.servlet.http.HttpServletRequest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@WebAppConfiguration
class AccessPointRestControllerTest {

    @Autowired
    private AccessPointService apService;

    @Autowired
    private AccessPointRestController apRestController;

    String name;
    AccessPoint ap;
    Map<String, Object> jsonCreateAP;
    Map<String, Object> jsonUpdateAP;

    @BeforeEach
    void setUp() {
        name = "AP 1";
        ap = apService.loadAPByName(name);

        jsonUpdateAP = new HashMap<>();
        jsonUpdateAP.put("status", "ONLINE");

        jsonCreateAP = new HashMap<>();
        jsonCreateAP.put("serverAddress", "192.168.0.101");
    }

    @Test
    void testGetAllAccessPoints() {
        int number = apService.getAllAP().size();
        var response = apRestController.getAllAccessPoints();
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var accessPoints = response.getBody();
        assertNotNull(accessPoints);
        assertEquals(number, accessPoints.size());
    }

    @Test
    void testGetAPById() {
        var response = apRestController.getAPByName(name);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var accessPoint = response.getBody();
        assertNotNull(accessPoint);
        assertEquals(name, accessPoint.getName());

        // if ap id does not exist in database, 404 not found error
        assertThrows(
            NotFoundInDatabaseException.class,
            () -> apRestController.getAPByName("notExistingAPName")
        );
    }

    @DirtiesContext
    @ParameterizedTest
    @ValueSource(strings = {"a", "ap123", "aP_134", "1092", "ALKJD*(&£)", "$$$$$$$$$"})
    void testAdvertiseUnconfirmedAP(Object newApName) {
        jsonCreateAP.put("name", newApName);

        // response status for a newly created AP should be 401
        HttpServletRequest request = mock(HttpServletRequest.class);
        var response = apRestController.advertiseAP(jsonCreateAP, request);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        
        var responseBody = response.getBody();
        assertNotNull(responseBody);
        
        // newly created AP should have status UNCONFIRMED
        var ap = responseBody.getAp();
        assertEquals(newApName.toString(), ap.getName());
        assertEquals(AccessPointStatus.UNCONFIRMED, ap.getStatus());
    }

    @DirtiesContext
    @Test
    void testAdvertiseAPNumericName() {
        testAdvertiseUnconfirmedAP(10101);
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testAdvertiseConfirmedAP() {
        jsonCreateAP.put("name", name);

        AccessPoint ap = new AccessPoint(name, "192.168.0.101", AccessPointStatus.ONLINE);
        ap = apService.saveAP(ap);

        // response status should be 200 after confirmation
        HttpServletRequest request = mock(HttpServletRequest.class);
        var response = apRestController.advertiseAP(jsonCreateAP, request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @DirtiesContext
    @Test
    void testAdvertiseThrowsErrors() {
        jsonCreateAP.put("name", null);
        HttpServletRequest request = mock(HttpServletRequest.class);
        assertThrows(
                BadRequestException.class,
                () -> apRestController.advertiseAP(jsonCreateAP, request)
        );

        jsonCreateAP.put("name", "APname");
        jsonCreateAP.put("serverAddress", null);
        assertThrows(
                BadRequestException.class,
                () -> apRestController.advertiseAP(jsonCreateAP, request)
        );
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testUpdateAP() {
        var response = apRestController.updateAP(name, jsonUpdateAP);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var accessPoint = response.getBody();
        assertNotNull(accessPoint);
        assertEquals(name, accessPoint.getName());
        assertEquals(
            AccessPointStatus.valueOf((String)jsonUpdateAP.get("status")),
            accessPoint.getStatus()
        );

        // if ap id does not exist in database, 404 not found error
        assertThrows(
            NotFoundInDatabaseException.class,
            () -> apRestController.updateAP("notExistingAPName", jsonUpdateAP)
        );
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testDeleteAPById() {
        int originalSize = apService.getAllAP().size();

        var response = apRestController.deleteAPById(name);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(originalSize-1, apService.getAllAP().size());

        // if ap id does not exist in database, 404 not found error
        assertThrows(
            NotFoundInDatabaseException.class,
            () -> apRestController.getAPByName(name),
            "AccessPoint is still found in database after being deleted."
        );
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedDeleteAP() {
        assertThrows(
            AccessDeniedException.class,
            () -> apRestController.deleteAPById(name)
        );
    }
}
