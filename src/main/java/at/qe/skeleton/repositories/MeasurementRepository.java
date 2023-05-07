package at.qe.skeleton.repositories;

import at.qe.skeleton.models.Measurement;
import org.springframework.stereotype.Repository;

public interface MeasurementRepository extends AbstractRepository<Measurement, Long> {

    Measurement findFirstById(Integer id);

}
