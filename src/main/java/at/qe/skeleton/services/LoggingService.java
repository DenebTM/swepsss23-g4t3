package at.qe.skeleton.services;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.repositories.LoggingEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
     * @param endDate end date
     * @return list of logs in time period beginning - 'to'
     */
    public List<LoggingEvent> getAllLogsTo(Object endDate) {
        LocalDate to;
        if (endDate instanceof String end) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            to = LocalDate.parse(end, formatter);
            ZonedDateTime zoneTo = ZonedDateTime.of(to.atTime(10, 0, 0), ZoneId.systemDefault());
            return loggingEventRepository.findAllByTimestmpLessThanEqualOrderByTimestmpAsc(zoneTo.toInstant().toEpochMilli());
            /*
            ArrayList<LoggingEvent> result = new ArrayList<>();
            List<LoggingEvent> logs = loggingEventRepository.findAllByOrderByTimestmpDesc();
            for (LoggingEvent l :
                    logs) {
                if (LocalDate.ofInstant(Instant.ofEpochSecond(l.getTimestmp()), TimeZone.getDefault().toZoneId()).isAfter(to)) {
                    break;
                }
                result.add(l);
            }
            return result;*/
        } else {
            throw new IllegalArgumentException();
        }
    }

    /**
     * Returns all available logs starting at parameter 'from' and ending with the latest event
     * @param beginDate begin date
     * @return list of logs in time period 'from' - ending
     */
    public List<LoggingEvent> getAllLogsFrom(Object beginDate) {
        LocalDate from;
        if (beginDate instanceof String beginning) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            from = LocalDate.parse(beginning, formatter);
            ZonedDateTime zoneFrom = ZonedDateTime.of(from.atTime(10, 0, 0), ZoneId.systemDefault());
            return loggingEventRepository.findAllByTimestmpGreaterThanEqualOrderByTimestmpAsc(zoneFrom.toInstant().toEpochMilli());
        } else {
            throw new IllegalArgumentException();
        }
    }

    /**
     * Returns all available logs starting at parameter 'from' and ending at parameter 'to'
     * @param beginDate begin date
     * @param endDate end date
     * @return list of logs in time period 'from' - 'to'
     */
    public List<LoggingEvent> getAllLogsInTimeInterval(Object beginDate, Object endDate) {
        LocalDate from;
        LocalDate to;
        if (beginDate instanceof String beginning && endDate instanceof String end) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            from = LocalDate.parse(beginning, formatter);
            to = LocalDate.parse(end, formatter);
            ZonedDateTime zoneFrom = ZonedDateTime.of(from.atTime(0, 0, 0), ZoneId.systemDefault());
            ZonedDateTime zoneTo = ZonedDateTime.of(to.atTime(0, 0, 0), ZoneId.systemDefault());
            return loggingEventRepository.findAllByTimestmpGreaterThanAndTimestmpLessThanOrderByTimestmpAsc(zoneFrom.toInstant().toEpochMilli(), zoneTo.toInstant().toEpochMilli());
        } else {
            throw new IllegalArgumentException();
        }
    }

    /**
     * Returns all logs at a specific level
     * @param level logging level
     * @return all logs that have the set level
     */
    public List<LoggingEvent> getLogsByLevel(String level) {
        return loggingEventRepository.findAllByLevelStringOrderByTimestmpAsc(level);
    }

    public List<LoggingEvent> filterLogsByLevel(List<LoggingEvent> logs, Object level) {
        List<String> validLevels = List.of("INFO", "WARN", "ERROR");
        List<LoggingEvent> result = new ArrayList<>();
        if (level instanceof String lev) {
            if (validLevels.contains(lev)) {
                for (LoggingEvent l :
                        logs) {
                    if (l.getLevelString().equals(lev)) {
                        result.add(l);
                    }
                }
            } else {
                throw new IllegalArgumentException();
            }
        } else {
            throw new IllegalArgumentException();
        }
        return result;
    }
}
