package at.qe.skeleton.models;

import at.qe.skeleton.models.enums.LogLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "logging_event")
public class LoggingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @GenericGenerator(name = "seq", strategy = "increment")
    @Column(name = "event_id")
    @JdbcTypeCode(SqlTypes.BIGINT)
    private Long eventId;

    @Column(name = "timestmp", nullable = false)
    @JdbcTypeCode(SqlTypes.BIGINT)
    private Long timestmp;

    @Column(name = "formatted_message", nullable = false)
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String formattedMessage;

    @Column(name = "level_string", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Enumerated(EnumType.STRING)
    private LogLevel level;

    @Column(name = "logger_name")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String loggerName;

    @Column(name = "thread_name")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String threadName;

    @Column(name = "reference_flag")
    @JdbcTypeCode(SqlTypes.SMALLINT)
    private Integer referenceFlag;

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


    public LoggingEvent(String message, LogLevel level, Long timestamp) {
        this.formattedMessage = message;
        this.level = level;
        this.timestmp = timestamp;
    }

}
