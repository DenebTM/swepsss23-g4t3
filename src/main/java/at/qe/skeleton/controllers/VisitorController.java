package at.qe.skeleton.controllers;

import at.qe.skeleton.controllers.api.SensorStationRestController;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.SensorStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

/**
 * Rest controller to enable access to uploading a photo or viewing all photos of a specific
 * sensor station for visitors (not logged in users).
 */
@RestController
public class VisitorController {

    @Autowired
    private SensorStationService ssService;
    @Autowired
    private PhotoDataRepository photoDataRepository;

    private static final String SS_PHOTOS_PATH = SensorStationRestController.SS_ID_PATH + "/photos";

    /**
     * Route to POST images to the photo gallery
     * @param multipartImage
     * @param id
     * @return id and name of Photo
     * @throws IOException
     */
    @PostMapping(value = SS_PHOTOS_PATH)
    public ResponseEntity<PhotoData> uploadPhoto(@RequestParam MultipartFile multipartImage, @PathVariable(value = "id") Integer id) throws IOException {
        PhotoData dbPhoto = new PhotoData();
        dbPhoto.setName(multipartImage.getName());
        try {
            dbPhoto.setContent(multipartImage.getBytes());
        } catch (IOException e) {
            throw new NotFoundInDatabaseException("Could not get bytes for photo", dbPhoto.getId());
        }
        SensorStation ss = ssService.loadSSById(id);
        if (ss != null) {
            dbPhoto.setSensorStation(ss);
            photoDataRepository.save(dbPhoto);
            return ResponseEntity.ok(dbPhoto);
        }
        throw new NotFoundInDatabaseException("Sensor Station", id);
    }

    /**
     * Route to GET all photos from a specific sensor-station by its ID
     * @param id
     * @return list of photos
     */
    @GetMapping(value = SS_PHOTOS_PATH)
    public ResponseEntity<Collection<PhotoData>> getAllPhotosBySS(@PathVariable(value = "id") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss != null) {
            List<PhotoData> photos = photoDataRepository.findAllBySensorStation(ss);
            return ResponseEntity.ok(photos);
        }
        throw new NotFoundInDatabaseException("Sensor Station", id);
    }
}
