package at.qe.skeleton.repositories;

import at.qe.skeleton.models.AccessPoint;
import org.springframework.stereotype.Repository;

public interface AccessPointRepository extends AbstractRepository<AccessPoint, Long> {

    AccessPoint findFirstByName(String name);

}
