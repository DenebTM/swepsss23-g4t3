package at.qe.skeleton.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

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
    @Column(name = "ORIGIN")
    private String origin;
    @Column(name = "DETAILS")
    private String details;

    public AuditLogEntry(Long id, LocalDateTime timestamp, LogLevel level, String origin, String details) {
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

    public String getOrigin() {
        return origin;
    }

    public String getDetails() {
        return details;
    }
}
