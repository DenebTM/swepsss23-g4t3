package at.qe.skeleton.repositories;

import at.qe.skeleton.models.Measurement;

public interface MeasurementRepository extends AbstractRepository<Measurement, Long> {

    Measurement findFirstById(Long id);
}
