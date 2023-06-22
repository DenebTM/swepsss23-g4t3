package at.qe.skeleton.controllers;

import at.qe.skeleton.controllers.api.SensorStationRestController;
import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.LoggingService;
import at.qe.skeleton.services.SensorStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Rest controller to enable access to uploading a photo or viewing all photos of a specific
 * sensor station for visitors (not logged in users).
 */
@RestController
public class VisitorController {

    private static final String PHOTOS_PATH = "/photos";
    private static final String PHOTOS_ID_PATH = PHOTOS_PATH + "/{photoId}";
    private static final String SS_PHOTOS_PATH = SensorStationRestController.SS_ID_PATH + PHOTOS_PATH;

    private static final Long MAX_IMAGE_SIZE = 8 * 1024 * 1024L;

    @Autowired
    private LoggingService logger;

    @Autowired
    private SensorStationService ssService;
    @Autowired
    private PhotoDataRepository photoDataRepository;

    /**
     * Route to POST images to the photo gallery
     * @param multipartImage image file
     * @param ssId id of sensor station to upload to
     * @return id and name of Photo
     */
    @PostMapping(value = SS_PHOTOS_PATH)
    public ResponseEntity<PhotoData> uploadPhoto(@RequestParam MultipartFile multipartImage, @PathVariable(value = "id") Integer ssId) {
        PhotoData dbPhoto = new PhotoData();
        try {
            if (multipartImage.getSize() > MAX_IMAGE_SIZE) {
                throw new MaxUploadSizeExceededException(MAX_IMAGE_SIZE);
            }
            if (multipartImage.getBytes().length == 0) {
                throw new BadRequestException("Could not get bytes for uploaded photo");
            }
            dbPhoto.setUploaded(LocalDateTime.now());
            dbPhoto.setContent(multipartImage.getBytes());
            SensorStation ss = ssService.loadSSById(ssId);
            if (ss == null) {
                throw new NotFoundInDatabaseException(SensorStationRestController.SS, ssId);
            }
            dbPhoto.setSensorStation(ss);
            photoDataRepository.save(dbPhoto);

            logger.info("New photo added", LogEntityType.SENSOR_STATION, ssId, getClass());
        } catch (IOException e) {
            logger.warn("Photo upload failed", LogEntityType.SENSOR_STATION, ssId, getClass());

            throw new NotFoundInDatabaseException("Bytes for photo", dbPhoto.getId());
        }
        return ResponseEntity.ok(dbPhoto);
    }

    /**
     * Route to GET a single photo as jpeg image by its ID
     * @param photoId id of the photo
     * @return jpeg image
     */
    @GetMapping(value = PHOTOS_ID_PATH, produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody ResponseEntity<byte[]> getPhotoById(@PathVariable(value = "photoId") Integer photoId) {
        Optional<PhotoData> maybePhoto = photoDataRepository.findById(photoId);

        if (maybePhoto.isEmpty()) {
            throw new NotFoundInDatabaseException("Photo", photoId);
        }

        PhotoData photo = maybePhoto.get();
        if (photo.getContent().length == 0) {
            throw new NotFoundInDatabaseException("Bytes for photo", photoId);
        }

        return ResponseEntity.ok(photo.getContent());
    }

    /**
     * Route to get a list of all photos from a specific sensor station as json
     * @param ssId id of the sensor station
     * @return list of PhotoData objects
     */
    @GetMapping(value = SS_PHOTOS_PATH)
    public ResponseEntity<List<PhotoData>> getSSPhotoList(@PathVariable(value = "id") Integer ssId) {
        SensorStation ss = ssService.loadSSById(ssId);
        if (ss == null) {
            throw new NotFoundInDatabaseException(SensorStationRestController.SS, ssId);
        }
        List<PhotoData> photos = photoDataRepository.findAllBySensorStation(ss);
        return ResponseEntity.ok(photos);
    }

}
