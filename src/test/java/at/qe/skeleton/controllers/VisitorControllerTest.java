package at.qe.skeleton.controllers;

import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.SensorStationService;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

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
        List<Integer> expectedPhotoIds =
            photoDataRepository.findAllBySensorStation(ss).stream()
                .map(PhotoData::getId)
                .collect(Collectors.toList());

        var response = visitorController.getSSPhotoList(ss.getSsID());
        var ssPhotoList = response.getBody();

        assertNotNull(ssPhotoList);
        assertEquals(3, ssPhotoList.size());
        assertEquals(expectedPhotoIds,
            ssPhotoList.stream()
                .map(PhotoData::getId)
                .collect(Collectors.toList())
        );
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
        assertThrows(NotFoundInDatabaseException.class, () -> visitorController.uploadPhoto(result, 99));
    }

    @Test
    void testNoPhotosToReturn() {
        if (!photoDataRepository.findAll().isEmpty()) {
            List<PhotoData> list = photoDataRepository.findAll();
            for (PhotoData p : list) {
                photoDataRepository.delete(p);
            }
        }

        var response = visitorController.getSSPhotoList(1);
        var ssPhotoList = response.getBody();

        assertNotNull(ssPhotoList);
        assertTrue(ssPhotoList.isEmpty());
    }

    @Test
    void uploadTooLargeImage() throws IOException {
        MultipartFile mock = new MockMultipartFile(
                "large_file.jpg",
                "large_file.jpg",
                "image/jpeg",
                FileUtils.readFileToByteArray(new File("src/test/resources/large_file.jpg")));
        assertThrows(MaxUploadSizeExceededException.class, () -> visitorController.uploadPhoto(mock, 1));
    }

    @Test
    void uploadNoBytes() {
        MultipartFile mock = new MockMultipartFile(
                "something",
                "something",
                "image/jpeg",
                (byte[]) null);
        assertThrows(BadRequestException.class, () -> visitorController.uploadPhoto(mock, 1));
    }

    @Test
    void uploadPhotoCorrectly() throws IOException {
        SensorStation ss = new SensorStation();
        ss.setSsID(1);
        List<PhotoData> repoImages = photoDataRepository.findAllBySensorStation(ss);
        int initialSize = repoImages.size();
        byte[] bytes = FileUtils.readFileToByteArray(new File("src/test/resources/example2.jpg"));
        MultipartFile mock = new MockMultipartFile(
                "example2.jpg",
                "example2.jpg",
                "image/jpeg",
                bytes);
        ResponseEntity<PhotoData> res = visitorController.uploadPhoto(mock, 1);
        repoImages = photoDataRepository.findAllBySensorStation(ss);
        int finalSize = repoImages.size();
        boolean contains = false;
        for (PhotoData p :
                repoImages) {
            if (Arrays.equals(p.getContent(), Objects.requireNonNull(res.getBody()).getContent())) {
                contains = true;
            }
        }
        assertTrue(contains);
        assertTrue(initialSize < finalSize);
    }
}
