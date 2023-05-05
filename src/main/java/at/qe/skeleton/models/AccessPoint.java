package at.qe.skeleton.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.net.InetAddress;
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
    private InetAddress serverAddress;

    @Column(name = "ACTIVE")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private Boolean active;

    @JsonBackReference
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

    public InetAddress getServerAddress() {
        return serverAddress;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public void setServerAddress(InetAddress serverAddress) {
        this.serverAddress = serverAddress;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}
