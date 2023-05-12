package at.qe.skeleton.controllers.api;

import at.qe.skeleton.services.MeasurementService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.test.context.web.WebAppConfiguration;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

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

    @Test
    void testGetAllMeasurementsInTimeRange() {
        Instant from = parseInstant("2023-03-01T20:10:40Z");
        Instant to = parseInstant("2023-05-20T10:40:00Z");

        int measurementCount = measurementService.getMeasurements(testSsId, from, to).size();

        var response = mmRestController.getMeasurementsBySS(testSsId, from, to);
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        var measurements = response.getBody();
        assertNotNull(measurements);
        assertEquals(measurementCount, measurements.size());
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
