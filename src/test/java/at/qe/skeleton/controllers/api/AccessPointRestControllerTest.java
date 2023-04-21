package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.AccessPoint;
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

    AccessPoint ap;
    Integer id;
    Map<String, Object> jsonUpdateAP = new HashMap<>();

    @BeforeEach
    void setUp() {
        id = 1;
        ap = apService.loadAPById(id);

        jsonUpdateAP.put("name", "newName");
        jsonUpdateAP.put("active", true);
    }

    @Test
    void testGetAllAccessPoints() {
        int number = apService.getAllAP().size();
        ResponseEntity response = this.apRestController.getAllAccessPoints();
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertEquals(number, ((Collection) response.getBody()).size());
    }

    @Test
    void testGetAPById() {
        ResponseEntity response = this.apRestController.getAPById(id);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertTrue(response.getBody() instanceof AccessPoint);
        if (response.getBody() instanceof AccessPoint){
            Assertions.assertEquals(id, ((AccessPoint) response.getBody()).getId());
        }
        // if ap id does not exist in database, 404 not found error
        ResponseEntity response404 = this.apRestController.getAPById(9999);
        Assertions.assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testUpdateAP() {
        ResponseEntity response = this.apRestController.updateAP(id, jsonUpdateAP);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertTrue(response.getBody() instanceof AccessPoint);
        if (response.getBody() instanceof AccessPoint){
            Assertions.assertEquals(id, ((AccessPoint) response.getBody()).getId());
            Assertions.assertEquals(jsonUpdateAP.get("name"), ((AccessPoint) response.getBody()).getName());
            Assertions.assertEquals(jsonUpdateAP.get("active"), ((AccessPoint) response.getBody()).getActive());
        }
        // if ap id does not exist in database, 404 not found error
        ResponseEntity response404 = this.apRestController.updateAP(9999, jsonUpdateAP);
        Assertions.assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testDeleteAPById() {
        int originalSize = apService.getAllAP().size();
        ResponseEntity response404 = this.apRestController.deleteAPById(99999);
        assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());

        ResponseEntity response = this.apRestController.deleteAPById(id);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(originalSize-1, apService.getAllAP().size());
        response404 = this.apRestController.getAPById(id);
        assertSame(HttpStatusCode.valueOf(404), response404.getStatusCode(), "User is still found in database after being deleted.");
    }

    @Test
    @WithMockUser(username = "susi", authorities = {"GARDENER"})
    void testUnauthorizedDeleteAP() {
        try {
            ResponseEntity response = this.apRestController.deleteAPById(id);
            Assertions.assertEquals(HttpStatusCode.valueOf(403), response.getStatusCode());
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof AccessDeniedException);
        }
    }
}