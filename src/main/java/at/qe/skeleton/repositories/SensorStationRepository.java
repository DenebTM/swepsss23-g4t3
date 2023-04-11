package at.qe.skeleton.repositories;

import at.qe.skeleton.models.SensorStation;

public interface SensorStationRepository extends AbstractRepository<SensorStation, Long>{

    SensorStation findFirstById(Long id);
}
