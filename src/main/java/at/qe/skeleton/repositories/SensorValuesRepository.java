package at.qe.skeleton.repositories;

import at.qe.skeleton.models.SensorValues;

public interface SensorValuesRepository extends AbstractRepository<SensorValues, Long> {

    SensorValues findFirstById(Long id);
}
