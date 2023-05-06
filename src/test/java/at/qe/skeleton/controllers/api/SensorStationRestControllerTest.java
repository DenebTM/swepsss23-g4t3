package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.repositories.AccessPointRepository;
import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@WebAppConfiguration
class SensorStationRestControllerTest {

    @Autowired
    private SensorStationRestController ssRestController;

    @Autowired
    private SensorStationService ssService;

    @Autowired
    private AccessPointRepository apRepository;

    @Autowired
    private UserService userService;

    SensorStation ss;
    Integer id;
    Map<String, Object> jsonUpdateSS = new HashMap<>();

    Userx susi;
    String username;

    @BeforeEach
    void setUp() {
        id = 1;
        ss = ssService.loadSSById(id);
        username = "susi";
        susi = userService.loadUserByUsername(username);

        jsonUpdateSS.put("status", "OFFLINE");
        jsonUpdateSS.put("aggregationPeriod", 50);
    }

    @Test
    void testGetAllSensorStations() {
        int number = ssService.getAllSS().size();
        ResponseEntity response = this.ssRestController.getAllSensorStations();
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertEquals(number, ((Collection) response.getBody()).size());
    }
    
    @Test
    void testGetSSForAccessPoint() {
        String apName = "AP Test";
        AccessPoint apTest = apRepository.save(new AccessPoint(apName));

        SensorStation ssTest = new SensorStation(apTest, 30L);
        ssTest.setId(127);

        var response = this.ssRestController.getSSForAccessPoint(apName);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertEquals(0, response.getBody().size());
        ssService.saveSS(ssTest);

        var response2 = this.ssRestController.getSSForAccessPoint(apName);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response2.getStatusCode());
        Assertions.assertEquals(1, response2.getBody().size());
    }

    @Test
    void testGetSSById() {
        ResponseEntity response = this.ssRestController.getSSById(id);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertTrue(response.getBody() instanceof SensorStation);
        if (response.getBody() instanceof SensorStation){
            Assertions.assertEquals(id, ((SensorStation) response.getBody()).getId());
        }
        // if ss id does not exist in database, 404 not found error
        ResponseEntity response404 = this.ssRestController.getSSById(9999);
        Assertions.assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
    }

    // TODO write a test for updateSS()
//    @Test
//    void testUpdateSS() {
//    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testDeleteSSById() {
        int originalSize = ssService.getAllSS().size();
        ResponseEntity response404 = this.ssRestController.deleteSSById(99999);
        assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());

        ResponseEntity response = this.ssRestController.deleteSSById(id);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(originalSize-1, ssService.getAllSS().size());
        response404 = this.ssRestController.getSSById(id);
        assertSame(HttpStatusCode.valueOf(404), response404.getStatusCode(), "Sensor station is still found in database after being deleted.");
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetGardenersBySS() {
        ResponseEntity response404 = this.ssRestController.getGardenersBySS(99999);
        assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());

        ResponseEntity response = this.ssRestController.getGardenersBySS(id);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(ss.getGardeners().contains(susi), ((List) response.getBody()).contains(username));
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testAssignGardenerToSS() {
        List<String> originalNames = ssService.getGardenersBySS(ss);
        int originalSize = originalNames.size();
        ResponseEntity response = this.ssRestController.assignGardenerToSS(id,username);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        if (!originalNames.contains(username)){
            assertEquals(originalSize+1, ((SensorStation) response.getBody()).getGardeners().size());
        } else {
            assertEquals(originalSize, ((SensorStation) response.getBody()).getGardeners().size());
        }
        ResponseEntity response404 = this.ssRestController.assignGardenerToSS(99999, username);
        assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
        response404 = this.ssRestController.assignGardenerToSS(id, "notExistingUsername");
        assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());

    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testRemoveGardenerFromSS() {
        List<String> originalNames = ssService.getGardenersBySS(ss);
        int originalSize = originalNames.size();
        ResponseEntity response = this.ssRestController.removeGardenerFromSS(id,username);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        if (originalNames.contains(username)){
            assertEquals(originalSize-1, ((SensorStation) response.getBody()).getGardeners().size());
        }
        ResponseEntity response404 = this.ssRestController.removeGardenerFromSS(99999, username);
        assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
        response404 = this.ssRestController.removeGardenerFromSS(id, "notExistingUsername");
        assertEquals(HttpStatusCode.valueOf(404), response404.getStatusCode());
    }

    // TODO write a test for getAllPhotosBySS()
//    @Test
//    void testGetAllPhotosBySS() {
//    }
}
