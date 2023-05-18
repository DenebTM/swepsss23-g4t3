package at.qe.skeleton.repositories;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.models.enums.LogLevel;

import java.util.List;

public interface LoggingEventRepository extends AbstractRepository<LoggingEvent, String> {

    @Override
    List<LoggingEvent> findAll();

    List<LoggingEvent> findAllByOrderByTimestmpAsc();

    List<LoggingEvent> findAllByTimestmpGreaterThanEqualAndTimestmpLessThanEqualOrderByTimestmpAsc(Long from, Long to);

    List<LoggingEvent> findAllByLevelInOrderByTimestmpAsc(List<LogLevel> level);

    List<LoggingEvent> findAllByTimestmpGreaterThanEqualOrderByTimestmpAsc(Long from);

    List<LoggingEvent> findAllByTimestmpLessThanEqualOrderByTimestmpAsc(Long to);
}
