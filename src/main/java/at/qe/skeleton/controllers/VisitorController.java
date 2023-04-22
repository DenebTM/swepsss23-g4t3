package at.qe.skeleton.controllers;

import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.PhotoDataRepository;
import at.qe.skeleton.services.SensorStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class VisitorController {

    @Autowired
    private SensorStationService ssService;
    @Autowired
    private PhotoDataRepository photoDataRepository;

    /**
     * Route to POST images to the photo gallery
     * @param multipartImage
     * @return the photoId
     * @throws Exception
     */
    @PostMapping(value = "/sensor-stations/{uuid}/photos")
    ResponseEntity<Object> uploadPhoto(@RequestParam MultipartFile multipartImage, @PathVariable(value = "uuid") Integer id) throws Exception {
        PhotoData dbPhoto = new PhotoData();
        dbPhoto.setName(multipartImage.getName());
        dbPhoto.setContent(multipartImage.getBytes());
        SensorStation ss = ssService.loadSSById(id);
        if (ss != null) {
            dbPhoto.setSensorStation(ss);
            photoDataRepository.save(dbPhoto);
            return ResponseEntity.ok(dbPhoto);
        }
        return HelperFunctions.notFoundError("Photo", dbPhoto.getName());
    }
}
