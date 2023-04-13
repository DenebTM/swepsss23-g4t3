package at.qe.skeleton.repositories;

import at.qe.skeleton.model.ImageData;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageDataRepository extends AbstractRepository<ImageData, Integer> {


    Optional<ImageData> findByName(String name);
}
