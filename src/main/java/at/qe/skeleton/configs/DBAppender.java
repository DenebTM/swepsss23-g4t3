package at.qe.skeleton.configs;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.LoggingEvent;
import ch.qos.logback.core.AppenderBase;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class DBAppender extends AppenderBase<ILoggingEvent> {

    private ConcurrentMap<String, ILoggingEvent> eventMap
            = new ConcurrentHashMap<>();
    private UserConverter converter;

    @Override
    protected void append(ILoggingEvent iLoggingEvent) {
        LoggingEvent event = (LoggingEvent) iLoggingEvent;
        event.setLoggerName(converter.convert(iLoggingEvent));
        eventMap.put(String.valueOf(System.currentTimeMillis()), event);
    }

    public Map<String, ILoggingEvent> getEventMap() {
        return eventMap;
    }
}
