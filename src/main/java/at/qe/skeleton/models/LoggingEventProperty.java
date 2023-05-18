package at.qe.skeleton.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Entity
@Table(name = "logging_event_property")
@IdClass(LoggingEventProperty.CompositeKey.class)
public class LoggingEventProperty {
    @Getter
    public static class CompositeKey implements Serializable {
        private Long eventId;
        private String mappedKey;
    }

    @Id
    @Column(name = "event_id", nullable = false)
    @JoinColumn(table = "logging_event", name = "event_id")
    @JdbcTypeCode(SqlTypes.BIGINT)
    private Long eventId;

    @Id
    @Column(name = "mapped_key", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String mappedKey;

    @Column(name = "mapped_value")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String mappedValue;

}
