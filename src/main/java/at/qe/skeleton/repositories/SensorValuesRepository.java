package at.qe.skeleton.repositories;

import at.qe.skeleton.model.SensorValues;

public interface SensorValuesRepository extends AbstractRepository<SensorValues, Long> {

    SensorValues findFirstById(Long id);
}
