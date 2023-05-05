package at.qe.skeleton.repositories;

import at.qe.skeleton.models.SensorStation;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorStationRepository extends AbstractRepository<SensorStation, Long>{

    SensorStation findFirstById(Integer id);

    @Query("SELECT s FROM SensorStation s WHERE s.accessPoint.name = :ap_name")
    List<SensorStation> findByApName(@Param("ap_name") String apName);
}
