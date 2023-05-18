package at.qe.skeleton.tests;

import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.repositories.PhotoDataRepository;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

import java.io.File;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@WebAppConfiguration
public class PhotoDataTest {

    @Autowired
    PhotoDataRepository photoDataRepository;

    @Test
    public void uploadImage() throws IOException {
        PhotoData img = new PhotoData("example2", null, FileUtils.readFileToByteArray(new File("src/test/resources/example2.jpg")));
        photoDataRepository.save(img);
        PhotoData testimg = new PhotoData(2, "", null, new byte[0]);
        if (photoDataRepository.findByName("example2").isPresent()) {
            testimg = photoDataRepository.findByName("example2").get();
        }
        assertEquals(testimg, img);
    }

}
