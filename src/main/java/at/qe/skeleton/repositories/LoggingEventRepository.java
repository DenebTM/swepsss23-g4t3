package at.qe.skeleton.repositories;

import at.qe.skeleton.models.LoggingEvent;
import org.jboss.logging.annotations.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoggingEventRepository extends AbstractRepository<LoggingEvent, String> {

    @Override
    List<LoggingEvent> findAll();

    List<LoggingEvent> findAllByOrderByTimestmpAsc();

    List<LoggingEvent> findAllByTimestmpGreaterThanAndTimestmpLessThanOrderByTimestmpAsc(Long from, Long to);

    List<LoggingEvent> findAllByLevelStringOrderByTimestmpAsc(String level);

    List<LoggingEvent> findAllByTimestmpGreaterThanEqualOrderByTimestmpAsc(Long from);

    List<LoggingEvent> findAllByTimestmpLessThanEqualOrderByTimestmpAsc(Long to);
}
