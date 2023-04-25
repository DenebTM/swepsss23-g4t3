package at.qe.skeleton.repositories;

import at.qe.skeleton.models.SensorValues;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorValuesRepository extends AbstractRepository<SensorValues, Long> {

    SensorValues findFirstById(Integer id);
}
