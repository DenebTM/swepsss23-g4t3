package at.qe.skeleton.model;

import at.qe.skeleton.controllers.api.views.SSView;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;

import java.net.InetAddress;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ACCESS_POINT")
public class AccessPoint {

    @Id
    @JsonView(SSView.class)
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "AP_ID")
    private Integer id;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "LAST_UPDATE")
    private LocalDateTime lastUpdate;

    @Column(name = "SERVER_ADDRESS")
    private InetAddress serverAddress;

    @Column(name = "ACTIVE")
    private Boolean active;

    @JsonBackReference
    @OneToMany(mappedBy = "accessPoint",
            fetch = FetchType.EAGER,
            cascade = CascadeType.REMOVE,
            orphanRemoval = true)
    private Set<SensorStation> sensorStations = new HashSet<>();

    public AccessPoint() {
    }

    public Integer getId() {
        return id;
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

    public void setId(Integer ID) {
        this.id = ID;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}
