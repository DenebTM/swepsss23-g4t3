package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.services.MeasurementService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.web.WebAppConfiguration;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@WebAppConfiguration
class MeasurementRestControllerTest {

    Integer testSsId = 1;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    private static Instant parseInstant(String charseq) {
        LocalDate date = LocalDate.parse(charseq, formatter);
        ZonedDateTime zoneDate = ZonedDateTime.of(date.atTime(0, 0, 0), ZoneId.systemDefault());

        return zoneDate.toInstant();
    }

    @Autowired
    private MeasurementRestController mmRestController;

    @Autowired
    private MeasurementService measurementService;

    /**
     * the following test currently fails when run in conjunction with other tests
     * this could potentially be a bug in Hibernate?
     * see: https://discourse.hibernate.org/t/force-initializing-collection-loading/7172
     */

    @Test
    void testGetAllMeasurementsInTimeRange() {
        Instant from = parseInstant("2023-03-01T20:10:40Z");
        Instant to = parseInstant("2023-05-20T10:40:00Z");

        int measurementCount = measurementService.getMeasurements(testSsId, from, to).size();

        var response = mmRestController.getMeasurementsBySS(testSsId, from, to);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var measurements = response.getBody();
        assertNotNull(measurements);
        assertEquals(measurementCount, measurements.size());
    }

    @Test
    void testGetAllCurrentMeasurements() {
        Integer number = measurementService.getAllCurrentMeasurements().size();

        var response = mmRestController.getAllCurrentMeasurements();
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var measurements = response.getBody();
        assertNotNull(measurements);
        assertEquals(number, measurements.size());
    }

    @Test
    @WithMockUser(username = "admin", authorities = { "ADMIN" })
    void testSendMeasurement() {
        Map<String, Object> json = new HashMap<>();
        Instant mmTimestamp = Instant.now();
        json.put(MeasurementRestController.JSON_KEY_TIMESTAMP, mmTimestamp.toString());
        json.put("temperature", 2456);
        json.put("humidity", 30);
        json.put("airPressure", 90000);
        json.put("lightIntensity", 100);
        json.put("airQuality", 45);
        json.put("soilMoisture", 50);

        var response = mmRestController.sendMeasurement(testSsId, json);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        var measurement = response.getBody();
        assertNotNull(measurement);
        assertEquals(mmTimestamp, measurement.getTimestamp());
    }

    @Test
    void invalidDataGetMeasurementBySS() {
        assertThrows(NotFoundInDatabaseException.class, () -> mmRestController.getMeasurementsBySS(99, null, null));

        Instant to = parseInstant("2023-03-01T20:10:40Z");
        Instant from = parseInstant("2023-05-20T10:40:00Z");
        assertThrows(BadRequestException.class, () -> mmRestController.getMeasurementsBySS(1, from, to));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testInvalidSSSendMeasurement() {
        assertThrows(NotFoundInDatabaseException.class, () -> mmRestController.sendMeasurement(99, null));
    }

}
