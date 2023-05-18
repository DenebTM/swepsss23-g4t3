package at.qe.skeleton.controllers;

import at.qe.skeleton.controllers.api.SensorStationRestController;
import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.SensorStationService;
import org.apache.tomcat.util.http.fileupload.impl.FileSizeLimitExceededException;
import org.apache.tomcat.util.http.fileupload.impl.SizeException;
import org.apache.tomcat.util.http.fileupload.impl.SizeLimitExceededException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDateTime;
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
     * @param multipartImage image file
     * @param id id of sensor station to upload to
     * @return id and name of Photo
     */
    @PostMapping(value = SS_PHOTOS_PATH)
    ResponseEntity<Object> uploadPhoto(@RequestParam MultipartFile multipartImage, @PathVariable(value = "id") Integer id) {
        PhotoData dbPhoto = new PhotoData();
        try {
            if (multipartImage.getSize() > 8000000) {
                throw new SizeLimitExceededException("", multipartImage.getSize(), 8);
            }
            if (multipartImage.getBytes().length == 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bytes have length 0");
            }
            dbPhoto.setUploaded(LocalDateTime.now());
            dbPhoto.setContent(multipartImage.getBytes());
            SensorStation ss = ssService.loadSSById(id);
            if (ss == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sensor station not found");
            }
            dbPhoto.setSensorStation(ss);
            photoDataRepository.save(dbPhoto);
        } catch (SizeLimitExceededException e) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("Size limit for photo exceeded");
        } catch (FileSizeLimitExceededException e) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("File size limit for photo exceeded");
        }  catch (MaxUploadSizeExceededException e) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("Photo too large for upload");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not get bytes for photo");
        }
        return ResponseEntity.ok(dbPhoto);
    }

    /**
     * Route to GET a single photo as jpeg image by its ID
     * @param id id of the photo
     * @return jpeg image
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

    /**
     * Route to get a list of all photos from a specific sensor station as json
     * @param id id of the sensor station
     * @return list of PhotoData objects
     */
    @GetMapping(value = SS_PHOTOS_PATH)
    public ResponseEntity<Object> getPhotosBySSAsId(@PathVariable(value = "id") Integer id) {
        SensorStation ss = ssService.loadSSById(id);
        if (ss == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sensor station not found");
        }
        List<PhotoData> photos = photoDataRepository.findAllBySensorStation(ss);
        return ResponseEntity.ok(photos);
    }
}
