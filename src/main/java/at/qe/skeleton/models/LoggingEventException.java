package at.qe.skeleton.models;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@IdClass(LoggingEvent.class)
@Table(name = "logging_event_exception")
public class LoggingEventException {

    @Id
    @Column(name = "event_id", nullable = false)
    @JdbcTypeCode(SqlTypes.BIGINT)
    private Long eventId;

    @Id
    @Column(name = "i", nullable = false)
    @JdbcTypeCode(SqlTypes.SMALLINT)
    private Integer i;

    @Column(name = "trace_line", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private Long traceLine;
}
