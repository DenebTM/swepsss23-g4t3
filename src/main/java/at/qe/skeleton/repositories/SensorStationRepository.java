package at.qe.skeleton.repositories;

import at.qe.skeleton.models.SensorStation;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorStationRepository extends AbstractRepository<SensorStation, Long>{

    SensorStation findFirstById(Integer id);
}
