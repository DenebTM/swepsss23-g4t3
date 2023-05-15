package at.qe.skeleton.tests;

import at.qe.skeleton.controllers.VisitorController;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.SensorStationService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.Collection;
import java.util.List;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@WebAppConfiguration
public class VisitorControllerTest {

    @Autowired
    SensorStationService sensorStationService;
    @Autowired
    VisitorController visitorController;
    @Autowired
    PhotoDataRepository photoDataRepository;

    @Test
    void testGetAllPhotosBySensorStation() {
        SensorStation ss = sensorStationService.loadSSById(1);
        PhotoData testPhoto1 = new PhotoData();
        PhotoData testPhoto2 = new PhotoData();
        PhotoData testPhoto3 = new PhotoData();
        testPhoto1.setSensorStation(ss);
        testPhoto2.setSensorStation(ss);
        testPhoto3.setSensorStation(ss);

        photoDataRepository.save(testPhoto1);
        photoDataRepository.save(testPhoto2);
        photoDataRepository.save(testPhoto3);

        Collection<PhotoData> response = visitorController.getAllPhotosBySS(1).getBody();
        Assertions.assertEquals(3, response.size());
    }
}
