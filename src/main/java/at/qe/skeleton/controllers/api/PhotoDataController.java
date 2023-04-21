package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.SensorStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
public class PhotoDataController {

    @Autowired
    PhotoDataRepository photoDbRepository;
    @Autowired
    SensorStationService sensorStationService;

    private static final String SS_PATH = "/sensor-stations";
    private static final String SS_ID_PATH = SS_PATH + "/{uuid}";

    /**
     * Route to POST images to the photo gallery
     * @param multipartImage
     * @return the photoId
     * @throws Exception
     */
    @PostMapping(value = SS_ID_PATH + "/photos")
    Integer uploadImage(@RequestParam MultipartFile multipartImage, @PathVariable(value = "uuid") Integer id) throws Exception {
        PhotoData dbPhoto = new PhotoData();
        dbPhoto.setName(multipartImage.getName());
        dbPhoto.setContent(multipartImage.getBytes());
        SensorStation ss = sensorStationService.loadSSById(id);
        dbPhoto.setSensorStation(ss);
        return photoDbRepository.save(dbPhoto).getId();
    }

    /**
     * Route to DELete pictures from the gallery
     * @param photoId
     * @return the picture if found
     */
    @DeleteMapping(value = "/photo/{photoId}")
    ResponseEntity<Object> deletePhoto(@PathVariable Integer photoId) {
        Optional<PhotoData> maybePhoto = photoDbRepository.findById(photoId);
        if (maybePhoto.isPresent()) {
            photoDbRepository.delete(maybePhoto.get());
            return ResponseEntity.ok(maybePhoto.get());
        }
        return HelperFunctions.notFoundError("Photo", String.valueOf(photoId));
    }
}
