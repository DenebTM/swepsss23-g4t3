package at.qe.skeleton.services;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.repositories.LoggingEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class LoggingService {

    @Autowired
    LoggingEventRepository loggingEventRepository;

    /**
     * Gets all available logs from the repository
     * @return list of logs
     */
    public List<LoggingEvent> getAllLogs() {
        return loggingEventRepository.findAll();
    }

    public List<LoggingEvent> getAllLogsTo(LocalDateTime to) {
        ArrayList<LoggingEvent> result = new ArrayList<>();
        List<LoggingEvent> logs = loggingEventRepository.findAllByOrderByTimestmpAsc();
        for (LoggingEvent l :
                logs) {
            if (l.getTimestmp().isAfter(to)) {
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
            if (l.getTimestmp().isBefore(from)) {
                break;
            }
            result.add(l);
        }
        return result;
    }

    public List<LoggingEvent> getAllLogsInTimeInterval(LocalDateTime from, LocalDateTime to) {
        return loggingEventRepository.findAllByTimestmpGreaterThanAndTimestmpLessThanOrderByTimestmpAsc(from, to);
    }

    public List<LoggingEvent> loadLogsByTimestamp(LocalDateTime timestamp) {
        return loggingEventRepository.findAllByTimestmp(timestamp);
    }
}
