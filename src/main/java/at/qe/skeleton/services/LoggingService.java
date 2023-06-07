package at.qe.skeleton.services;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.models.LoggingEventJson;
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

    /**
     * returns all available logs from the repository, ordered by timestamp (latest events are shown first)
     * @return list of logs
     */
    public List<LoggingEvent> getAllLogs() {
        return loggingEventRepository.findAllByOrderByTimestmpDesc();
    }

    /**
     * returns all available logs starting from the beginning and ending at parameter 'to'
     * @param endDate end date
     * @return list of logs in time period beginning - 'to'
     */
    public List<LoggingEvent> getAllLogsTo(Instant endDate) {
        return loggingEventRepository.findAllByTimestmpLessThanEqualOrderByTimestmpDesc(endDate.toEpochMilli());
    }

    /**
     * returns all available logs starting at parameter 'from' and ending with the latest event
     * @param beginDate begin date
     * @return list of logs in time period 'from' - ending
     */
    public List<LoggingEvent> getAllLogsFrom(Instant beginDate) {
        return loggingEventRepository.findAllByTimestmpGreaterThanEqualOrderByTimestmpDesc(beginDate.toEpochMilli());
    }

    /**
     * returns all available logs starting at parameter 'from' and ending at parameter 'to'
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
            return loggingEventRepository.findAllByTimestmpGreaterThanEqualAndTimestmpLessThanEqualOrderByTimestmpDesc(
                beginDate.toEpochMilli(),
                endDate.toEpochMilli()
            );
        }
    }

    /**
     * returns all logs at a specific level, or all levels if level==null
     * 
     * @param levels logging levels
     * @return all logs that have one of the set levels
     */
    public List<LoggingEvent> getLogsByLevelIn(List<LogLevel> levels) {
        return loggingEventRepository.findAllByLevelInOrderByTimestmpDesc(levels);
    }

    public List<LoggingEvent> filterLogsByLevelIn(List<LoggingEvent> logs, List<LogLevel> levels) {
        if (levels == null) {
            return logs;
        }

        return logs.stream().filter(l -> levels.contains(l.getLevel())).toList();
    }

    public LoggingEvent saveLog(LoggingEvent log) {
        return loggingEventRepository.save(log);
    }

    public void debug(String message, LogEntityType entityType, Object entityId, Class<?> loggingClass) {
        Log logger = LogFactory.getLog(loggingClass);

        MDC.put(entityType.name(), entityId.toString());
        logger.debug(message);
    }

    public void info(String message, LogEntityType entityType, Object entityId, Class<?> loggingClass) {
        Log logger = LogFactory.getLog(loggingClass);

        MDC.put(entityType.name(), entityId.toString());
        logger.info(message);
    }

    public void warn(String message, LogEntityType entityType, Object entityId, Class<?> loggingClass) {
        Log logger = LogFactory.getLog(loggingClass);

        MDC.put(entityType.name(), entityId.toString());
        logger.warn(message);
    }

    public void error(String message, LogEntityType entityType, Object entityId, Class<?> loggingClass) {
        Log logger = LogFactory.getLog(loggingClass);

        MDC.put(entityType.name(), entityId.toString());
        logger.error(message);

    }
}
