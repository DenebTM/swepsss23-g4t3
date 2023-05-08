package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.services.MeasurementService;
import at.qe.skeleton.models.enums.SensorStationStatus;
import at.qe.skeleton.repositories.AccessPointRepository;
import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserxService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.web.WebAppConfiguration;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneOffset;
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
    private MeasurementService measurementService;

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
        var response = this.ssRestController.getAllSensorStations();
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertEquals(number, response.getBody().size());
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

        var response = this.ssRestController.getSSForAccessPoint(apTest.getName());
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertEquals(0, response.getBody().size());
        ssService.saveSS(ssTest);

        var response2 = this.ssRestController.getSSForAccessPoint(apTest.getName());
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response2.getStatusCode());
        Assertions.assertEquals(1, response2.getBody().size());
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
            () -> this.ssRestController.getSSForAccessPoint(apName)
        );
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testAddSS() {
        // INITIALIZATION
        AccessPoint apTest = createTestAP();

        var initialSSResponse = ssRestController.getSSForAccessPoint(apTest.getName());
        int initialSSCount = initialSSResponse.getBody().size();

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
        int finalSSCount = finalSSResponse.getBody().size();

        // check all sensor stations inserted
        assertEquals(initialSSCount + newSSCount, finalSSCount);

        // check sensor stations inserted for correct AP
        for (SensorStation ss : finalSSResponse.getBody()) {
            assertEquals(ss.getAccessPoint().getName(), apTest.getName());
        }

        // check sensor station status matches
        for (SensorStation ss : finalSSResponse.getBody()) {
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
        var response = this.ssRestController.getSSById(id);
        Assertions.assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        Assertions.assertTrue(response.getBody() instanceof SensorStation);
        if (response.getBody() instanceof SensorStation){
            Assertions.assertEquals(id, response.getBody().getId());
        }

        // if ss id does not exist in database, 404 not found error
        assertThrows(
            NotFoundInDatabaseException.class,
            () -> this.ssRestController.getSSById(99999)
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

        var response = this.ssRestController.deleteSSById(id);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(originalSize-1, ssService.getAllSS().size());

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> this.ssRestController.getSSById(id),
            "Sensor station is still found in database after being deleted."
        );
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetGardenersBySS() {
        var response = this.ssRestController.getGardenersBySS(id);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(ss.getGardeners().contains(susi), response.getBody().contains(username));

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> this.ssRestController.getGardenersBySS(99999)
        );
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testAssignGardenerToSS() {
        List<String> originalNames = ssService.getGardenersBySS(ss);
        int originalSize = originalNames.size();
        var response = this.ssRestController.assignGardenerToSS(id,username);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        if (!originalNames.contains(username)){
            assertEquals(originalSize+1, response.getBody().getGardeners().size());
        } else {
            assertEquals(originalSize, response.getBody().getGardeners().size());
        }

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> this.ssRestController.assignGardenerToSS(99999, username)
        );

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> this.ssRestController.assignGardenerToSS(id, "notExistingUsername")
        );
    }

    @DirtiesContext
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testRemoveGardenerFromSS() {
        List<String> originalNames = ssService.getGardenersBySS(ss);
        int originalSize = originalNames.size();
        var response = this.ssRestController.removeGardenerFromSS(id,username);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        if (originalNames.contains(username)){
            assertEquals(originalSize-1, response.getBody().getGardeners().size());
        }

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> this.ssRestController.removeGardenerFromSS(99999, username)
        );

        assertThrows(
            NotFoundInDatabaseException.class,
            () -> this.ssRestController.removeGardenerFromSS(id, "notExistingUsername")
        );
    }

    @Test
    void testGetAllMeasurementsInTimeRange() {
        Instant from = LocalDateTime.of(2023, Month.MARCH, 1, 20, 10, 40).toInstant(ZoneOffset.UTC);
        Instant to = LocalDateTime.of(2023, Month.MAY, 1, 20, 10, 40).toInstant(ZoneOffset.UTC);
        Integer number = measurementService.getMeasurements(id, from, to).size();
        jsonUpdateSS.put("from", from.toString());
        jsonUpdateSS.put("to", to.toString());

        var measurements = this.ssRestController.getMeasurementsBySS(id, jsonUpdateSS);
        assertEquals(HttpStatusCode.valueOf(200), measurements.getStatusCode());
        assertEquals(number, measurements.getBody().size());
    }

    @Test
    void testGetAllCurrentMeasurements(){
        Integer number = measurementService.getAllCurrentMeasurements().size();

        var measurements = this.ssRestController.getAllCurrentMeasurements();
        assertEquals(HttpStatusCode.valueOf(200), measurements.getStatusCode());
        assertEquals(number, measurements.getBody().size());
    }

    // TODO write a test for getAllPhotosBySS()
    // @Test
    //     void testGetAllPhotosBySS() {
    // }
}
