package at.qe.skeleton.repositories;

import at.qe.skeleton.models.LoggingEvent;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoggingEventRepository extends AbstractRepository<LoggingEvent, String> {

    List<LoggingEvent> findAllByTimestmp(Long timestmp);

    @Override
    List<LoggingEvent> findAll();

    List<LoggingEvent> findAllByOrderByTimestmpDesc();

    List<LoggingEvent> findAllByOrderByTimestmpAsc();

    List<LoggingEvent> findAllByTimestmpGreaterThanAndTimestmpLessThanOrderByTimestmpAsc(Long from, Long to);

    List<LoggingEvent> findAllByLevelStringOrderByTimestmpDesc(String level);
}
