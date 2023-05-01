package at.qe.skeleton.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "logging_event")
public class LoggingEvent {

    @Column(name = "timestmp", nullable = false)
    @JdbcTypeCode(SqlTypes.BIGINT)
    private LocalDateTime timestmp;

    @Column(name = "formatted_message", nullable = false)
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String formattedMessage;

    @Column(name = "logger_name", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String loggerName;

    @Column(name = "level_string", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String levelString;

    @Column(name = "thread_name")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String threadName;

    @Column(name = "reference_flag")
    @JdbcTypeCode(SqlTypes.SMALLINT)
    private String referenceFlag;

    @Column(name = "arg0")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String arg0;

    @Column(name = "arg1")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String arg1;

    @Column(name = "arg2")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String arg2;

    @Column(name = "arg3")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String arg3;

    @Column(name = "caller_filename")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String callerFilename;

    @Column(name = "caller_class")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String callerClass;

    @Column(name = "caller_method")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String callerMethod;

    @Column(name = "caller_line")
    @JdbcTypeCode(SqlTypes.CHAR)
    private String callerLine;

    @Id
    @Column(name = "event_id", nullable = false)
    @JdbcTypeCode(SqlTypes.BIGINT)
    private Long eventId;


}
