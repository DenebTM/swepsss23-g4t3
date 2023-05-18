package at.qe.skeleton.services;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.models.enums.LogLevel;
import at.qe.skeleton.repositories.LoggingEventRepository;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
public class LoggingService {

    @Autowired
    LoggingEventRepository loggingEventRepository;
    
    private Log logger = LogFactory.getLog(getClass());

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
    public List<LoggingEvent> getAllLogsTo(Instant endDate) {
        return loggingEventRepository.findAllByTimestmpLessThanEqualOrderByTimestmpAsc(endDate.toEpochMilli());
    }

    /**
     * Returns all available logs starting at parameter 'from' and ending with the latest event
     * @param beginDate begin date
     * @return list of logs in time period 'from' - ending
     */
    public List<LoggingEvent> getAllLogsFrom(Instant beginDate) {
        return loggingEventRepository.findAllByTimestmpGreaterThanEqualOrderByTimestmpAsc(beginDate.toEpochMilli());
    }

    /**
     * Returns all available logs starting at parameter 'from' and ending at parameter 'to'
     * 
     * @param beginDate
     * @param endDate
     * @return list of logs in time period 'from' - 'to'
     */
    public List<LoggingEvent> getAllLogsInTimeInterval(Instant beginDate, Instant endDate) {
        if (beginDate == null && endDate == null) {
            return getAllLogs();
        } else if (endDate == null) {
            return getAllLogsFrom(beginDate);
        } else if (beginDate == null) {
            return getAllLogsTo(endDate);
        } else {
            return loggingEventRepository.findAllByTimestmpGreaterThanEqualAndTimestmpLessThanEqualOrderByTimestmpAsc(
                beginDate.toEpochMilli(),
                endDate.toEpochMilli()
            );
        }
    }

    /**
     * Returns all logs at a specific level, or all levels if level==null
     * 
     * @param level logging level
     * @return all logs that have the set level
     */
    public List<LoggingEvent> getLogsByLevel(LogLevel level) {
        return loggingEventRepository.findAllByLevelOrderByTimestmpAsc(level);
    }

    public List<LoggingEvent> filterLogsByLevel(List<LoggingEvent> logs, LogLevel level) {
        if (level == null) {
            return logs;
        }

        return logs.stream().filter(l -> level.equals(l.getLevel())).toList();
    }

    public LoggingEvent saveLog(LoggingEvent log) {
        return loggingEventRepository.save(log);
    }

    public static boolean isValidLevel(String test) {

        for (LogLevel l : LogLevel.values()) {
            if (l.name().equals(test)) {
                return true;
            }
        }

        return false;
    }

    public void debug(String message, LogEntityType entityType, Object entityId) {
        MDC.put(entityType.name(), entityId.toString());
        logger.debug(message);
    }

    public void info(String message, LogEntityType entityType, Object entityId) {
        MDC.put(entityType.name(), entityId.toString());
        logger.info(message);
    }

    public void warn(String message, LogEntityType entityType, Object entityId) {
        MDC.put(entityType.name(), entityId.toString());
        logger.warn(message);
    }

    public void error(String message, LogEntityType entityType, Object entityId) {
        MDC.put(entityType.name(), entityId.toString());
        logger.error(message);

    }
}
