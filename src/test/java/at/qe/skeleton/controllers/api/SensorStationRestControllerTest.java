package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.Collection;
import java.util.HashMap;
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
    private UserService userService;

    SensorStation ss;
    Integer id;
    Map<String, Object> jsonUpdateSS = new HashMap<>();

    @BeforeEach
    void setUp() {
        id = 1;
        ss = ssService.loadSSById(id);

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

    @Test
    void testUpdateSS() {
    }

    @Test
    void testDeleteSSById() {
    }

    @Test
    void testGetGardenersBySS() {
    }

    @Test
    void testAssignGardenerToSS() {
    }

    @Test
    void testRemoveGardenerFromSS() {
    }
}