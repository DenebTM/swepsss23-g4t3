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
        String testImgName = "example2";

        PhotoData img = new PhotoData(testImgName, null, FileUtils.readFileToByteArray(new File("src/test/resources/example2.jpg")));
        
        // remove the image first to avoid a conflict
        photoDataRepository.removeByName(testImgName);

        photoDataRepository.save(img);
        PhotoData testimg = new PhotoData(2, "", null, new byte[0]);
        if (photoDataRepository.findByName("example2").isPresent()) {
            testimg = photoDataRepository.findByName("example2").get();
        }
        assertEquals(testimg, img);

        // remove the new image after the test
        photoDataRepository.removeByName(testImgName);
    }

}
