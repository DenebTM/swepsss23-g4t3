package at.qe.skeleton.repositories;

import at.qe.skeleton.model.AccessPoint;

public interface AccessPointRepository extends AbstractRepository<AccessPoint, Long> {

    AccessPoint findFirstById(Long id);
}
