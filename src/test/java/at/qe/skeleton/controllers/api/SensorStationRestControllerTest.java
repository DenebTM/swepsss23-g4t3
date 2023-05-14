package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.models.enums.SensorStationStatus;
import at.qe.skeleton.repositories.AccessPointRepository;
import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserxService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.ArrayList;
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
    private UserxService userService;

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
        var response = ssRestController.getAllSensorStations();
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var sensorStations = response.getBody();
        assertNotNull(sensorStations);
        assertEquals(number, sensorStations.size());
    }

    AccessPoint createTestAP() {
        String apName = "AP Test";
        return apRepository.save(new AccessPoint(apName));
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetSSForAccessPoint() {
        AccessPoint apTest = createTestAP();

        SensorStation ssTest = new SensorStation(apTest, 30L);
        ssTest.setId(127);

        // no sensor stations yet
        var initialResponse = ssRestController.getSSForAccessPoint(apTest.getName());
        assertEquals(HttpStatusCode.valueOf(200), initialResponse.getStatusCode());

        var initialSS = initialResponse.getBody();
        assertNotNull(initialSS);
        int initialSSCount = initialSS.size();

        // insert a sensor station, check if it is returned
        ssService.saveSS(ssTest);
        var finalResponse = ssRestController.getSSForAccessPoint(apTest.getName());
        assertEquals(HttpStatusCode.valueOf(200), finalResponse.getStatusCode());

        var finalSS = finalResponse.getBody();
        assertNotNull(finalSS);
        assertEquals(initialSSCount + 1, finalSS.size());
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetSSForAccessPoint404() {
        String apName = "ksdjflsadjfl";
        AccessPoint ap = new AccessPoint(apName);
        apRepository.delete(ap);

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> ssRestController.getSSForAccessPoint(apName)
        );
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testAddSS() {
        // INITIALIZATION
        AccessPoint apTest = createTestAP();

        var initialSSResponse = ssRestController.getSSForAccessPoint(apTest.getName());
        assertEquals(HttpStatusCode.valueOf(200), initialSSResponse.getStatusCode());

        var initialSS = initialSSResponse.getBody();
        assertNotNull(initialSS);
        int initialSSCount = initialSS.size();

        List<SensorStation> newSS = new ArrayList<>();
        SensorStation ssTest1 = new SensorStation(apTest, 30L);
        ssTest1.setId(127);
        ssTest1.setStatus(SensorStationStatus.AVAILABLE);
        newSS.add(ssTest1);
        SensorStation ssTest2 = new SensorStation(apTest, 30L);
        ssTest2.setId(128);
        ssTest2.setStatus(SensorStationStatus.AVAILABLE);
        newSS.add(ssTest2);
        int newSSCount = newSS.size();

        // TEST
        ssRestController.addSS(apTest.getName(), newSS);

        // ASSERTIONS
        var finalSSResponse = ssRestController.getSSForAccessPoint(apTest.getName());
        assertEquals(HttpStatusCode.valueOf(200), initialSSResponse.getStatusCode());
        var finalSS = finalSSResponse.getBody();
        assertNotNull(finalSS);
        int finalSSCount = finalSS.size();

        // check all sensor stations inserted
        assertEquals(initialSSCount + newSSCount, finalSSCount);

        // check sensor stations inserted for correct AP
        for (SensorStation ss : finalSS) {
            assertEquals(ss.getAccessPoint().getName(), apTest.getName());
        }

        // check sensor station status matches
        for (SensorStation ss : finalSS) {
            assertEquals(SensorStationStatus.AVAILABLE, ss.getStatus());
        }
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testAddSS404() {
        String apName = "ksdjflsadjfl";
        AccessPoint ap = new AccessPoint(apName);
        apRepository.delete(ap);

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> ssRestController.addSS(apName, new ArrayList<>())
        );
    }

    @Test
    void testGetSSById() {
        var response = ssRestController.getSSById(id);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var sensorStation = response.getBody();
        assertNotNull(sensorStation);
        assertEquals(id, sensorStation.getId());

        // if ss id does not exist in database, 404 not found error
        assertThrows(
            NotFoundInDatabaseException.class,
            () -> ssRestController.getSSById(99999)
        );
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

        var response = ssRestController.deleteSSById(id);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(originalSize-1, ssService.getAllSS().size());

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> ssRestController.getSSById(id),
            "Sensor station is still found in database after being deleted."
        );
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetGardenersBySS() {
        var response = ssRestController.getGardenersBySS(id);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var gardenerNames = response.getBody();
        assertNotNull(gardenerNames);
        assertEquals(ss.getGardeners().contains(susi), gardenerNames.contains(username));

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> ssRestController.getGardenersBySS(99999)
        );
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testAssignGardenerToSS() {
        List<String> originalNames = ssService.getGardenersBySS(ss);
        int originalSize = originalNames.size();
        var response = ssRestController.assignGardenerToSS(id,username);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var sensorStation = response.getBody();
        assertNotNull(sensorStation);
        if (!originalNames.contains(username)){
            assertEquals(originalSize+1, sensorStation.getGardeners().size());
        } else {
            assertEquals(originalSize, sensorStation.getGardeners().size());
        }

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> ssRestController.assignGardenerToSS(99999, username)
        );

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> ssRestController.assignGardenerToSS(id, "notExistingUsername")
        );
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testRemoveGardenerFromSS() {
        List<String> originalNames = ssService.getGardenersBySS(ss);
        int originalSize = originalNames.size();
        var response = ssRestController.removeGardenerFromSS(id,username);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var sensorStation = response.getBody();
        assertNotNull(sensorStation);
        if (originalNames.contains(username)){
            assertEquals(originalSize-1, sensorStation.getGardeners().size());
        }

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> ssRestController.removeGardenerFromSS(99999, username)
        );

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> ssRestController.removeGardenerFromSS(id, "notExistingUsername")
        );
    }

    // TODO write a test for getAllPhotosBySS()
    // @Test
    //     void testGetAllPhotosBySS() {
    // }
}
