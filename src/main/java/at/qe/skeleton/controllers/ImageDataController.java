package at.qe.skeleton.controllers;

import at.qe.skeleton.models.ImageData;
import at.qe.skeleton.repositories.ImageDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
public class ImageDataController {

    @Autowired
    ImageDataRepository imageDbRepository;

    @PostMapping
    Integer uploadImage(@RequestParam MultipartFile multipartImage) throws Exception {
        ImageData dbImage = new ImageData();
        dbImage.setName(multipartImage.getName());
        dbImage.setContent(multipartImage.getBytes());

        return imageDbRepository.save(dbImage)
                .getId();
    }

    @GetMapping(value = "/photo/{imageId}", produces = MediaType.IMAGE_JPEG_VALUE)
    ResponseEntity<Object> downloadImage(@PathVariable Integer imageId) {
        Optional<ImageData> image = imageDbRepository.findById(imageId);
        if (image.isPresent()) {
            return ResponseEntity.ok(image);
        }
        return HelperFunctions.notFoundError("Photo", String.valueOf(imageId));
    }

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
