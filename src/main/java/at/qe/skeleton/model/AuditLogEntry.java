package at.qe.skeleton.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "auditLogEntry")
@Table(name = "AUDIT_LOG_ENTRY")
public class AuditLogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID ID;
    @Column(name = "TIMESTAMP", nullable = false)
    private LocalDateTime timestamp;
    @Column(name = "LOG_LEVEL")
    private LogLevel level;
    @Column(name = "ORIGIN")
    private String origin;
    @Column(name = "DETAILS")
    private String details;

    public AuditLogEntry() {
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
