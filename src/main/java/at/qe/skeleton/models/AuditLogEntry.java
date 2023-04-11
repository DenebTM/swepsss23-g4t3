package at.qe.skeleton.models;

import at.qe.skeleton.models.enums.LogLevel;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity(name = "auditLogEntry")
@Table(name = "AUDIT_LOG_ENTRY")
public class AuditLogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "TIMESTAMP", nullable = false)
    private LocalDateTime timestamp;
    @Column(name = "LOG_LEVEL")
    private LogLevel level;

    @ManyToOne
    @JoinColumn(name = "ENTRY_ORIGIN")
    private LogEntity origin;

    @Column(name = "DETAILS")
    private String details;

    public AuditLogEntry(Long id, LocalDateTime timestamp, LogLevel level, LogEntity origin, String details) {
        this.id = id;
        this.timestamp = timestamp;
        this.level = level;
        this.origin = origin;
        this.details = details;
    }

    public AuditLogEntry() {

    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public LogLevel getLevel() {
        return level;
    }

    public LogEntity getOrigin() {
        return origin;
    }

    public String getDetails() {
        return details;
    }
}
