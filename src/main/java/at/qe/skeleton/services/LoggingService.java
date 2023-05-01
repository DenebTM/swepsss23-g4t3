package at.qe.skeleton.services;

import at.qe.skeleton.models.LoggingEvent;
import at.qe.skeleton.repositories.LoggingEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoggingService {

    @Autowired
    LoggingEventRepository loggingEventRepository;

    public List<LoggingEvent> loadLogs() {
        return loggingEventRepository.findAll();
    }
}
