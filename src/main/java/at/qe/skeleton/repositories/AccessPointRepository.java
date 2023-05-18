package at.qe.skeleton.repositories;

import java.util.List;

import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.enums.AccessPointStatus;

public interface AccessPointRepository extends AbstractRepository<AccessPoint, Long> {

    AccessPoint findFirstByName(String name);

    List<AccessPoint> findAllByStatusNot(AccessPointStatus status);

}
