package at.qe.skeleton.repositories;

import at.qe.skeleton.models.ImageData;
import at.qe.skeleton.models.SensorStation;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageDataRepository extends AbstractRepository<ImageData, Integer> {

    Optional<ImageData> findByName(String name);

    Optional<ImageData> findById(Integer id);

    List<ImageData> findAllBySensorStation(SensorStation sensorStation);

    Optional<ImageData> findByIdAndSensorStation(Integer id, SensorStation sensorStation);
}
