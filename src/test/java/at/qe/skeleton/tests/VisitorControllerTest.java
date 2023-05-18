package at.qe.skeleton.tests;

import at.qe.skeleton.controllers.VisitorController;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.SensorStationService;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


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

        List<PhotoData> response = (List<PhotoData>) visitorController.getPhotosBySSAsId(ss.getSsID()).getBody();
        List<Integer> ids = photoDataRepository.findAll().stream().map(PhotoData::getId).collect(Collectors.toList());
        Assertions.assertEquals(3, response.size());
        Assertions.assertEquals(ids, response.stream().map(PhotoData::getId).collect(Collectors.toList()));
    }

    @Test
    void testUploadPhotoInvalidSS() {
        Path path = Paths.get("src/test/resources/example2.jpg");
        String name = "example2.txt";
        String originalFileName = "example2.txt";
        String contentType = " image/jpeg";
        byte[] content = null;
        try {
            content = Files.readAllBytes(path);
        } catch (final IOException e) {
            e.printStackTrace();
        }
        MultipartFile result = new MockMultipartFile(name, originalFileName, contentType, content);
        Assertions.assertThrows(NotFoundInDatabaseException.class, () -> visitorController.uploadPhoto(result, 99));
    }

    @Test
    void testNoPhotosToReturn() {
        if (!photoDataRepository.findAll().isEmpty()) {
            List<PhotoData> list = photoDataRepository.findAll();
            for (PhotoData p :
                    list) {
                photoDataRepository.delete(p);
            }
        }
        Assertions.assertTrue(((List<PhotoData>) visitorController.getPhotosBySSAsId(1).getBody()).isEmpty());
    }
}
