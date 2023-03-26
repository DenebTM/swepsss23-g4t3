package at.qe.skeleton.repositories;

import at.qe.skeleton.model.Measurement;

public interface MeasurementRepository extends AbstractRepository<Measurement, Long> {

    Measurement findFirstByID(Long id);
}
