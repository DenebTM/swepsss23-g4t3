package at.qe.skeleton.controllers;

import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.SensorStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class VisitorController {

    @Autowired
    private SensorStationService ssService;
    @Autowired
    private PhotoDataRepository photoDataRepository;

    private static final String SS_PHOTOS_PATH = "/sensor-stations/{uuid}/photos";

    /**
     * Route to POST images to the photo gallery
     * @param multipartImage
     * @param id
     * @return id and name of Photo
     * @throws IOException
     */
    @PostMapping(value = SS_PHOTOS_PATH)
    ResponseEntity<Object> uploadPhoto(@RequestParam MultipartFile multipartImage, @PathVariable(value = "uuid") Integer id) throws IOException {
        PhotoData dbPhoto = new PhotoData();
        dbPhoto.setName(multipartImage.getName());
        try {
            dbPhoto.setContent(multipartImage.getBytes());
        } catch (IOException e) {
            return HelperFunctions.notFoundError("Getting Bytes from Photo failed", String.valueOf(dbPhoto.getId()));
        }
        SensorStation ss = ssService.loadSSById(id);
        if (ss != null) {
            dbPhoto.setSensorStation(ss);
            photoDataRepository.save(dbPhoto);
            return ResponseEntity.ok(dbPhoto);
        }
        return HelperFunctions.notFoundError("Sensor Station", String.valueOf(id));
    }

    /**
     * Route to GET all photos from a specific sensor-station by its ID
     * @param id
     * @return list of photos
     */
    @GetMapping(value = SS_PHOTOS_PATH)
    public ResponseEntity<Object> getAllPhotosBySS(@PathVariable(value = "uuid") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss != null) {
            List<PhotoData> photos = photoDataRepository.findAllBySensorStation(ss);
            return ResponseEntity.ok(photos);
        }
        return HelperFunctions.notFoundError("Sensor Station", String.valueOf(id));
    }
}
