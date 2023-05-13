package at.qe.skeleton.models;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "logging_event")
public class LoggingEvent {
    static List<String> validLevels = List.of("INFO", "WARN", "ERROR");

    @Column(name = "timestmp", nullable = false)
    @JdbcTypeCode(SqlTypes.BIGINT)
    @JsonProperty(value = "timestamp")
    private Long timestmp;

    @JsonGetter(value = "timestamp")
    public String getISOTimestamp() {
        return Instant.ofEpochMilli(timestmp).toString();
    }

    @Column(name = "formatted_message", nullable = false)
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String formattedMessage;

    @JsonIgnore
    @Column(name = "logger_name", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String loggerName;

    @Column(name = "level_string", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String levelString;

    @JsonIgnore
    @Column(name = "thread_name")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String threadName;

    @JsonIgnore
    @Column(name = "reference_flag")
    @JdbcTypeCode(SqlTypes.SMALLINT)
    private Integer referenceFlag;

    @JsonIgnore
    @Column(name = "arg0")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String arg0;

    @JsonIgnore
    @Column(name = "arg1")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String arg1;

    @JsonIgnore
    @Column(name = "arg2")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String arg2;

    @JsonIgnore
    @Column(name = "arg3")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String arg3;

    @JsonIgnore
    @Column(name = "caller_filename")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String callerFilename;

    @Column(name = "caller_class")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String callerClass;

    @JsonIgnore
    @Column(name = "caller_method")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String callerMethod;

    @JsonIgnore
    @Column(name = "caller_line")
    @JdbcTypeCode(SqlTypes.CHAR)
    private String callerLine;

    @JsonIgnore
    @Id
    @Column(name = "event_id", nullable = false)
    @JdbcTypeCode(SqlTypes.BIGINT)
    private Long eventId;

    @Override
    public String toString() {
        return "LoggingEvent{" +
                "timestmp=" + timestmp +
                ", formattedMessage='" + formattedMessage + '\'' +
                ", loggerName='" + loggerName + '\'' +
                ", levelString='" + levelString + '\'' +
                '}';
    }
}
