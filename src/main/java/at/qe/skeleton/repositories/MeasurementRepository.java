package at.qe.skeleton.repositories;

import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeasurementRepository extends AbstractRepository<Measurement, Long> {

    Measurement findFirstById(Integer id);

    List<Measurement> findAllBySensorStationOrderByTimestampAsc(SensorStation sensorStation);

    List<Measurement> findAllBySensorStationAndTimestampGreaterThanAndTimestampLessThanOrderByTimestampAsc(SensorStation sensorStation, LocalDateTime start, LocalDateTime end);

    @Override
    List<Measurement> findAll();

    List<Measurement> findFirstBySensorStationOrderByTimestamp(SensorStation sensorStation);
}
