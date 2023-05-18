package at.qe.skeleton.controllers;

import at.qe.skeleton.controllers.api.SensorStationRestController;
import at.qe.skeleton.controllers.errors.NotFoundInDatabaseException;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.SensorStationService;
import org.apache.tomcat.util.http.fileupload.impl.FileSizeLimitExceededException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

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
     */
    @PostMapping(value = SS_PHOTOS_PATH)
    ResponseEntity<Object> uploadPhoto(@RequestParam MultipartFile multipartImage, @PathVariable(value = "id") Integer id) {
        PhotoData dbPhoto = new PhotoData();
        dbPhoto.setUploaded(LocalDateTime.now());
        dbPhoto.setName(multipartImage.getName());

        //limit file size to 8MB
        if(multipartImage.getSize()/1000000 > 8) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("Photo too large for upload");
        }
        try {
            dbPhoto.setContent(multipartImage.getBytes());
        } catch (IOException e) {
            throw new NotFoundInDatabaseException("Could not get bytes for photo", dbPhoto.getId());
        }
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            throw new NotFoundInDatabaseException("Sensor Station", id);
        }
        dbPhoto.setSensorStation(ss);
        photoDataRepository.save(dbPhoto);
        return ResponseEntity.ok(dbPhoto);
    }

    /**
     * Route to GET all photos from a specific sensor-station by its ID
     * @param id
     * @return list of photos
     * see maybe https://www.callicoder.com/spring-boot-file-upload-download-rest-api-example/
     */
    @GetMapping(value = "photos/{photoId}", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody ResponseEntity<Object> getPhotoById(@PathVariable(value = "photoId") Integer id){
        if (photoDataRepository.findById(id).isPresent()) {
            if (photoDataRepository.findById(id).get().getContent().length == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Byte content of photo not found");
            }
            return ResponseEntity.ok(photoDataRepository.findById(id).get().getContent());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Photo not found");
    }

    @GetMapping(value = SS_PHOTOS_PATH)
    public ResponseEntity<Object> getPhotosBySSAsId(@PathVariable(value = "id") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sensor station not found");
        }
        List<PhotoData> photos = photoDataRepository.findAllBySensorStation(ss);
        if (photos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Photos not found");
        }
        return ResponseEntity.ok(photos);
    }
}
