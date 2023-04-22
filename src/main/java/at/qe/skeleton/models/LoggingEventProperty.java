package at.qe.skeleton.models;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@IdClass(LoggingEvent.class)
@Table(name = "logging_event_property")
public class LoggingEventProperty {

    @Id
    @Column(name = "event_id", nullable = false)
    @JdbcTypeCode(SqlTypes.BIGINT)
    private Long eventId;

    @Id
    @Column(name = "mapped_key", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String mappedKey;

    @Column(name = "mapped_value")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String mappedValue;
}
