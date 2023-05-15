package at.qe.skeleton.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import at.qe.skeleton.models.enums.AccessPointStatus;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ACCESS_POINT")
public class AccessPoint {

    @Id
    @Column(name = "AP_NAME", nullable = false)
    private String name;

    @Column(name = "LAST_UPDATE")
    private LocalDateTime lastUpdate;

    @Column(name = "SERVER_ADDRESS")
    private String serverAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "AP_STATUS")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private AccessPointStatus status;

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "ssID")
    @JsonIdentityReference(alwaysAsId = true)
    @OneToMany(mappedBy = "accessPoint",
            fetch = FetchType.EAGER,
            cascade = CascadeType.REMOVE,
            orphanRemoval = true)
    private Set<SensorStation> sensorStations = new HashSet<>();

    public AccessPoint() {
    }

    public AccessPoint(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getLastUpdate() {
        return lastUpdate;
    }

    public String getServerAddress() {
        return serverAddress;
    }

    public AccessPointStatus getStatus() {
        return this.status;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public void setServerAddress(String serverAddress) {
        this.serverAddress = serverAddress;
    }

    public void setStatus(AccessPointStatus status) {
        this.status = status;
    }

    public Set<SensorStation> getSensorStations() {
        return sensorStations;
    }
}
