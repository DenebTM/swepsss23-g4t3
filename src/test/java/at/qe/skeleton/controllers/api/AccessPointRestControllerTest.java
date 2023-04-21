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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.Collection;

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

    @BeforeEach
    void setUp() {
        id = 1;
        ap = apService.loadAPById(id);
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

    @Test
    void testUpdateAP() {
    }

    @Test
    void testDeleteAPById() {
    }
}