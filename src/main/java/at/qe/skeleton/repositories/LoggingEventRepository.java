package at.qe.skeleton.repositories;

import at.qe.skeleton.models.LoggingEvent;

import java.util.List;

public interface LoggingEventRepository extends AbstractRepository<LoggingEvent, String> {

    @Override
    List<LoggingEvent> findAll();

    List<LoggingEvent> findAllByOrderByTimestmpAsc();

    List<LoggingEvent> findAllByTimestmpGreaterThanAndTimestmpLessThanOrderByTimestmpAsc(Long from, Long to);

    List<LoggingEvent> findAllByLevelStringOrderByTimestmpAsc(String level);

    List<LoggingEvent> findAllByTimestmpGreaterThanEqualOrderByTimestmpAsc(Long from);

    List<LoggingEvent> findAllByTimestmpLessThanEqualOrderByTimestmpAsc(Long to);
}
