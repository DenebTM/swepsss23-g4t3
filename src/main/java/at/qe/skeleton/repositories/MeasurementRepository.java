package at.qe.skeleton.repositories;

import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;

import java.time.Instant;
import java.util.List;

public interface MeasurementRepository extends AbstractRepository<Measurement, Long> {

    // This immense method name is automatically generated, resembles SQL and works the same way
    List<Measurement> findAllBySensorStationAndTimestampGreaterThanAndTimestampLessThanOrderByTimestampAsc(SensorStation sensorStation, Instant start, Instant end);

    @Override
    List<Measurement> findAll();

    Measurement findFirstById(Integer id);

    List<Measurement> findFirstBySensorStationOrderByTimestampDesc(SensorStation sensorStation);

    List<Measurement> findAllByOrderBySensorStationAscTimestampDesc();

}
