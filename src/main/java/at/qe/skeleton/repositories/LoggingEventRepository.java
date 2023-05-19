package at.qe.skeleton.repositories;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.models.enums.LogLevel;

import java.util.List;

public interface LoggingEventRepository extends AbstractRepository<LoggingEvent, String> {

    @Override
    List<LoggingEvent> findAll();

    List<LoggingEvent> findAllByOrderByTimestmpDesc();

    List<LoggingEvent> findAllByTimestmpGreaterThanEqualAndTimestmpLessThanEqualOrderByTimestmpDesc(Long from, Long to);

    List<LoggingEvent> findAllByLevelInOrderByTimestmpDesc(List<LogLevel> levels);

    List<LoggingEvent> findAllByTimestmpGreaterThanEqualOrderByTimestmpDesc(Long from);

    List<LoggingEvent> findAllByTimestmpLessThanEqualOrderByTimestmpDesc(Long to);

}
