package at.qe.skeleton;

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
        PhotoData img = new PhotoData(null, FileUtils.readFileToByteArray(new File("src/test/resources/example2.jpg")));
        photoDataRepository.save(img);
        int id = img.getId();
        assert(photoDataRepository.findById(id).isPresent());
        assertEquals(photoDataRepository.findById(id).get(), img);
        assertTrue(photoDataRepository.findById(id).get().getContent().length > 0);
    }
}
