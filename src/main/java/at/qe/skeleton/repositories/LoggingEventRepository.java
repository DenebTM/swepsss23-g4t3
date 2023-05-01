package at.qe.skeleton.repositories;

import at.qe.skeleton.models.LoggingEvent;

import java.time.LocalDateTime;
import java.util.List;

public interface LoggingEventRepository extends AbstractRepository<LoggingEvent, String> {

    LoggingEvent findByTimestmp(LocalDateTime timestmp);

    @Override
    List<LoggingEvent> findAll();
}
