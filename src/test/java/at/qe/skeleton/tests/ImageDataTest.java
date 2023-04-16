package at.qe.skeleton.tests;

import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.ImageData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.AccessPointRepository;
import at.qe.skeleton.repositories.ImageDataRepository;
import at.qe.skeleton.repositories.SensorStationRepository;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.io.IOException;

@SpringBootTest
public class ImageDataTest {

    @Autowired
    ImageDataRepository imageDataRepository;

    @Test
    public void uploadImage() throws IOException {
        ImageData img = new ImageData("example2", null, FileUtils.readFileToByteArray(new File("src/test/resources/example2.jpg")));
        imageDataRepository.save(img);
        ImageData testimg = new ImageData(2, "", null, new byte[0]);
        if (imageDataRepository.findByName("example2").isPresent()) {
            testimg = imageDataRepository.findByName("example2").get();
        }
        Assertions.assertEquals(testimg, img);
    }
}
