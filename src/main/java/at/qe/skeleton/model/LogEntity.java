package at.qe.skeleton.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity
public class LogEntity {

    @Id
    @Column(name = "ID")
    private Integer id;

    @Column(name = "LOG_ENTITY_TYPE")
    private LogEntityType logEntityType;

    public LogEntity() {
    }

    public LogEntity(Integer id, LogEntityType logEntityType) {
        this.id = id;
        this.logEntityType = logEntityType;
    }

    public Integer getId() {
        return id;
    }

    public LogEntityType getLogEntityType() {
        return logEntityType;
    }

    public void setLogEntityType(LogEntityType logEntityType) {
        this.logEntityType = logEntityType;
    }
}
