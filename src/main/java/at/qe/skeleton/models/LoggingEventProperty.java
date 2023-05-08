package at.qe.skeleton.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@AllArgsConstructor
@Getter
@Table(name = "logging_event_property")
public class LoggingEventProperty {


    @Id
    @Column(name = "event_id", nullable = false)
    @JdbcTypeCode(SqlTypes.BIGINT)
    private String eventID;

    @Id
    @Column(name = "mapped_key", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String mappedKey;

    @Column(name = "mapped_value")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String mappedValue;
}
