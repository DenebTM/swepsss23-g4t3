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
    public void testUploadImage() throws IOException {
        PhotoData img = new PhotoData("example2", null, FileUtils.readFileToByteArray(new File("src/test/resources/example2.jpg")));
        photoDataRepository.save(img);
        int id = img.getId();
        //PhotoData testimg = new PhotoData(2, "photo2", null, new byte[0]);
        assert(photoDataRepository.findByName("example2").isPresent());
        assert(photoDataRepository.findById(id).isPresent());
        assertEquals(photoDataRepository.findByName("example2").get(), img);
        assertEquals(photoDataRepository.findById(id).get(), img);
        assertTrue(photoDataRepository.findById(id).get().getContent().length > 0);
    }

}
