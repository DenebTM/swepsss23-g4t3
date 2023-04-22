package at.qe.skeleton.repositories;

import at.qe.skeleton.models.AccessPoint;

public interface AccessPointRepository extends AbstractRepository<AccessPoint, Long> {

    AccessPoint findFirstByName(String name);
}
