package at.qe.skeleton.services;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.repositories.LoggingEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.TimeZone;

@Service
public class LoggingService {

    @Autowired
    LoggingEventRepository loggingEventRepository;

    /**
     * Gets all available logs from the repository
     * @return list of logs
     */
    public List<LoggingEvent> getAllLogs() {
        return loggingEventRepository.findAllByOrderByTimestmpAsc();
    }

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
        return result;
    }

    public List<LoggingEvent> getAllLogsInTimeInterval(LocalDateTime from, LocalDateTime to) {
        ZonedDateTime zoneFrom = ZonedDateTime.of(from, ZoneId.systemDefault());
        ZonedDateTime zoneTo = ZonedDateTime.of(to, ZoneId.systemDefault());
        return loggingEventRepository.findAllByTimestmpGreaterThanAndTimestmpLessThanOrderByTimestmpAsc(zoneFrom.toInstant().toEpochMilli(), zoneTo.toInstant().toEpochMilli());
    }

    public List<LoggingEvent> loadLogsByTimestamp(LocalDateTime timestamp) {
        ZonedDateTime zdt = ZonedDateTime.of(timestamp, ZoneId.systemDefault());
        return loggingEventRepository.findAllByTimestmp(zdt.toInstant().toEpochMilli());
    }
}
