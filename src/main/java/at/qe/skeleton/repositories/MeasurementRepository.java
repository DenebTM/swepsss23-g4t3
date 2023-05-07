package at.qe.skeleton.repositories;

import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import org.jboss.logging.annotations.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeasurementRepository extends AbstractRepository<Measurement, Long> {

    //This immense method name is automatically generated, resembles sql and works the same way
    List<Measurement> findAllBySensorStationAndTimestampGreaterThanAndTimestampLessThanOrderByTimestampAsc(SensorStation sensorStation, Instant start, Instant end);

    @Override
    List<Measurement> findAll();

    List<Measurement> findFirstBySensorStationOrderByTimestampDesc(SensorStation sensorStation);

    List<Measurement> findAllByOrderBySensorStationAscTimestampDesc();
}
