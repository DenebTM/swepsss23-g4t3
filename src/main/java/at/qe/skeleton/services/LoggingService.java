package at.qe.skeleton.services;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.repositories.LoggingEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

@Service
public class LoggingService {

    @Autowired
    LoggingEventRepository loggingEventRepository;

    /**
     * Returns all available logs from the repository, ordered by timestamp (latest events are shown first)
     * @return list of logs
     */
    public List<LoggingEvent> getAllLogs() {
        return loggingEventRepository.findAllByOrderByTimestmpAsc();
    }

    /**
     * Returns all available logs starting from the beginning and ending at parameter 'to'
     * @param to end date
     * @return list of logs in time period beginning - 'to'
     */
    public List<LoggingEvent> getAllLogsTo(LocalDateTime to) {
        ArrayList<LoggingEvent> result = new ArrayList<>();
        List<LoggingEvent> logs = loggingEventRepository.findAllByOrderByTimestmpAsc();
        for (LoggingEvent l :
                logs) {
            if (LocalDateTime.ofInstant(Instant.ofEpochSecond(l.getTimestmp()), TimeZone.getDefault().toZoneId()).isAfter(to)) {
                break;
            }
            result.add(l);
        }
        return result;
    }

    /**
     * Returns all available logs starting at parameter 'from' and ending with the latest event
     * @param from begin date
     * @return list of logs in time period 'from' - ending
     */
    public List<LoggingEvent> getAllLogsFrom(LocalDateTime from) {
        ArrayList<LoggingEvent> result = new ArrayList<>();
        List<LoggingEvent> logs = loggingEventRepository.findAllByOrderByTimestmpDesc();
        for (LoggingEvent l :
                logs) {
            if (LocalDateTime.ofInstant(Instant.ofEpochSecond(l.getTimestmp()), TimeZone.getDefault().toZoneId()).isBefore(from)) {
                break;
            }
            result.add(l);
        }
        Collections.reverse(result);
        return result;
    }

    /**
     * Returns all available logs starting at parameter 'from' and ending at parameter 'to'
     * @param from begin date
     * @param to end date
     * @return list of logs in time period 'from' - 'to'
     */
    public List<LoggingEvent> getAllLogsInTimeInterval(LocalDateTime from, LocalDateTime to) {
        ZonedDateTime zoneFrom = ZonedDateTime.of(from, ZoneId.systemDefault());
        ZonedDateTime zoneTo = ZonedDateTime.of(to, ZoneId.systemDefault());
        return loggingEventRepository.findAllByTimestmpGreaterThanAndTimestmpLessThanOrderByTimestmpAsc(zoneFrom.toInstant().toEpochMilli(), zoneTo.toInstant().toEpochMilli());
    }

    /**
     * Returns all logs at a specific level
     * @param level logging level
     * @return all logs that have the set level
     */
    public List<LoggingEvent> getLogsByLevel(String level) {
        return loggingEventRepository.findAllByLevelStringOrderByTimestmpDesc(level);
    }
}
