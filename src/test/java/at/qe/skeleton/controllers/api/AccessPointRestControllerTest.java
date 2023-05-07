package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.enums.AccessPointStatus;
import at.qe.skeleton.services.AccessPointService;
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

import java.util.Collection;
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
        ResponseEntity<?> response = this.apRestController.getAllAccessPoints();
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertEquals(number, ((Collection<?>) response.getBody()).size());
    }

    @Test
    void testGetAPById() {
        ResponseEntity<?> response = this.apRestController.getAPByName(name);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertTrue(response.getBody() instanceof AccessPoint);
        if (response.getBody() instanceof AccessPoint){
            assertEquals(name, ((AccessPoint) response.getBody()).getName());
        }
        // if ap id does not exist in database, 404 not found error
        ResponseEntity<?> response404 = this.apRestController.getAPByName("notExistingAPName");
        assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testUpdateAP() {
        ResponseEntity<?> response = this.apRestController.updateAP(name, jsonUpdateAP);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertTrue(response.getBody() instanceof AccessPoint);
        if (response.getBody() instanceof AccessPoint){
            assertEquals(name, ((AccessPoint)response.getBody()).getName());
            assertEquals(
                AccessPointStatus.valueOf((String)jsonUpdateAP.get("status")),
                ((AccessPoint)response.getBody()).getStatus()
            );
        }
        // if ap id does not exist in database, 404 not found error
        ResponseEntity<?> response404 = this.apRestController.updateAP("notExistingAPName", jsonUpdateAP);
        assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testDeleteAPById() {
        int originalSize = apService.getAllAP().size();
        ResponseEntity<?> response404 = this.apRestController.deleteAPById("notExistingAPName");
        assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());

        ResponseEntity<?> response = this.apRestController.deleteAPById(name);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(originalSize-1, apService.getAllAP().size());
        response404 = this.apRestController.getAPByName(name);
        assertSame(HttpStatusCode.valueOf(404), response404.getStatusCode(), "AccessPoint is still found in database after being deleted.");
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedDeleteAP() {
        try {
            ResponseEntity<?> response = this.apRestController.deleteAPById(name);
            Assertions.assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof AccessDeniedException);
        }
    }
}
