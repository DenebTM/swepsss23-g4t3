package at.qe.skeleton.models;

import java.time.Instant;
import java.util.Collection;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.models.enums.LogLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@JsonSerialize
@Getter
public class LoggingEventJson {

    @AllArgsConstructor
    @Getter
    static class LogEntity {
        LogEntityType type;
        Object id;
    }

    Long id;

    Instant timestamp;

    LogLevel level;

    String message;

    LogEntity origin;


    public LoggingEventJson(LoggingEvent event, Collection<LoggingEventProperty> props) {
        this.id = event.getEventId();
        this.timestamp = Instant.ofEpochMilli(event.getTimestmp());
        this.message = event.getFormattedMessage();
        this.level = LogLevel.valueOf(event.getLevelString());

        if (props == null) return;
        LoggingEventProperty originProp = null;
        for (String type : new String[]{"USER", "ACCESS_POINT", "SENSOR_STATION"}) {
            var maybeProp = props.stream().filter(p -> p.getMappedKey().equals(type)).findFirst();
            if (maybeProp.isPresent()) {
                originProp = maybeProp.get();
            }
        }
                
        if (originProp != null) {
            var type = LogEntityType.valueOf(originProp.getMappedKey());
            var id = originProp.getMappedValue();

            this.origin = new LogEntity(type, id);
        }
    }

}
