package at.qe.skeleton.controllers.api;

import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.services.MeasurementService;
import at.qe.skeleton.services.SensorStationService;
import at.qe.skeleton.services.UserxService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.test.context.web.WebAppConfiguration;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@WebAppConfiguration
class MeasurementRestControllerTest {

    @Autowired
    private MeasurementRestController mmRestController;

    @Autowired
    private SensorStationService ssService;

    @Autowired
    private MeasurementService measurementService;

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
    void testGetAllMeasurementsInTimeRange() {
        Instant from = LocalDateTime.of(2023, Month.MARCH, 1, 20, 10, 40).toInstant(ZoneOffset.UTC);
        Instant to = LocalDateTime.of(2023, Month.MAY, 1, 20, 10, 40).toInstant(ZoneOffset.UTC);
        Integer number = measurementService.getMeasurements(id, from, to).size();
        jsonUpdateSS.put("from", from.toString());
        jsonUpdateSS.put("to", to.toString());

        var response = mmRestController.getMeasurementsBySS(id, jsonUpdateSS);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var measurements = response.getBody();
        assertNotNull(measurements);
        assertEquals(number, measurements.size());
    }

    @Test
    void testGetAllCurrentMeasurements(){
        Integer number = measurementService.getAllCurrentMeasurements().size();

        var response = mmRestController.getAllCurrentMeasurements();
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var measurements = response.getBody();
        assertNotNull(measurements);
        assertEquals(number, measurements.size());
    }

}
