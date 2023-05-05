package at.qe.skeleton.repositories;

import at.qe.skeleton.models.LoggingEvent;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoggingEventRepository extends AbstractRepository<LoggingEvent, String> {

    List<LoggingEvent> findAllByTimestmp(LocalDateTime timestmp);

    @Override
    List<LoggingEvent> findAll();
}
