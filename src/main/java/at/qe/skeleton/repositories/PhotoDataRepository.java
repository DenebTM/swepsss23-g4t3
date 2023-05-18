package at.qe.skeleton.repositories;

import at.qe.skeleton.models.PhotoData;
import at.qe.skeleton.models.SensorStation;

import java.util.List;
import java.util.Optional;

public interface PhotoDataRepository extends AbstractRepository<PhotoData, Integer> {

    Optional<PhotoData> findByName(String name);

    Optional<PhotoData> findById(Integer id);

    List<PhotoData> findAllBySensorStation(SensorStation sensorStation);

    Optional<PhotoData> findByIdAndSensorStation(Integer id, SensorStation sensorStation);
}
