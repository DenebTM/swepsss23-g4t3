package at.qe.skeleton.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity
public class LogEntity {

    @Id
    @Column(name = "ID")
    private UUID id;

    @Column(name = "LOG_ENTITY_TYPE")
    private LogEntityType logEntityType;

    public LogEntity() {
        this.id = UUID.randomUUID();
    }

    public UUID getId() {
        return id;
    }

    public LogEntityType getLogEntityType() {
        return logEntityType;
    }

    public void setLogEntityType(LogEntityType logEntityType) {
        this.logEntityType = logEntityType;
    }
}
