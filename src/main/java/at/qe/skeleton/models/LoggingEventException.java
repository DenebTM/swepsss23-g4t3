package at.qe.skeleton.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@AllArgsConstructor
@Getter
@Table(name = "logging_event_exception")
public class LoggingEventException {

    @PrimaryKeyJoinColumn
    @OneToOne(mappedBy = "event_id", cascade = CascadeType.ALL)
    @Column(name = "event_id", nullable = false)
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
