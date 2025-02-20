package at.qe.skeleton.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Table(name = "logging_event_exception")
@AllArgsConstructor
@Getter
public class LoggingEventException {

    @Id
    @Column(name = "event_id", nullable = false)
    @JoinColumn(table = "logging_event", name = "event_id")
    @JdbcTypeCode(SqlTypes.BIGINT)
    private String eventID;

    @Id
    @Column(name = "i", nullable = false)
    @JdbcTypeCode(SqlTypes.SMALLINT)
    private String i;

    @Column(name = "trace_line", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String mappedValue;

}
