package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.enums.AccessPointStatus;
import at.qe.skeleton.services.AccessPointService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@WebAppConfiguration
class AccessPointRestControllerTest {

    @Autowired
    private AccessPointService apService;

    @Autowired
    private AccessPointRestController apRestController;

    String name;
    AccessPoint ap;
    Map<String, Object> jsonUpdateAP;

    @BeforeEach
    void setUp() {
        name = "AP 1";
        ap = apService.loadAPByName(name);

        jsonUpdateAP = new HashMap<>();
        jsonUpdateAP.put("status", "ONLINE");
    }

    @Test
    void testGetAllAccessPoints() {
        int number = apService.getAllAP().size();
        var response = this.apRestController.getAllAccessPoints();
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var accessPoints = response.getBody();
        assertNotNull(accessPoints);
        assertEquals(number, accessPoints.size());
    }

    @Test
    void testGetAPById() {
        var response = this.apRestController.getAPByName(name);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

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
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testUpdateAP() {
        var response = this.apRestController.updateAP(name, jsonUpdateAP);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

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

        var response = this.apRestController.deleteAPById(name);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
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
