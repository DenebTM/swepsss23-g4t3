package at.qe.skeleton.controllers.api;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.models.ImageData;
import at.qe.skeleton.repositories.ImageDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
public class ImageDataController {

    @Autowired
    ImageDataRepository imageDbRepository;

    /**
     * Route to POST images to the photo gallery
     * @param multipartImage
     * @return the imageId
     * @throws Exception
     */
    @PostMapping
    Integer uploadImage(@RequestParam MultipartFile multipartImage) throws Exception {
        ImageData dbImage = new ImageData();
        dbImage.setName(multipartImage.getName());
        dbImage.setContent(multipartImage.getBytes());
        return imageDbRepository.save(dbImage).getId();
    }

    /**
     * Route to GET images from the gallery, aka download pictures
     * @param imageId
     * @return the picture if found
     */
    @GetMapping(value = "/photo/{imageId}", produces = MediaType.IMAGE_JPEG_VALUE)
    ResponseEntity<Object> downloadImage(@PathVariable Integer imageId) {
        Optional<ImageData> maybeImage = imageDbRepository.findById(imageId);
        return maybeImage.<ResponseEntity<Object>>map(ResponseEntity::ok).orElseGet(() -> HelperFunctions.notFoundError("Photo", String.valueOf(imageId)));
    }

    /**
     * Route to DELete pictures from the gallery
     * @param imageId
     * @return the picture if found
     */
    @DeleteMapping(value = "/photo/{imageId}")
    ResponseEntity<Object> deletePhoto(@PathVariable Integer imageId) {
        Optional<ImageData> maybeImage = imageDbRepository.findById(imageId);
        if (maybeImage.isPresent()) {
            imageDbRepository.delete(maybeImage.get());
            return ResponseEntity.ok(maybeImage.get());
        }
        return HelperFunctions.notFoundError("Photo", String.valueOf(imageId));
    }
}
