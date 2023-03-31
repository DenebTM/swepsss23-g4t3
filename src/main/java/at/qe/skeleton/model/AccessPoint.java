package at.qe.skeleton.model;

import jakarta.persistence.*;

import java.net.InetAddress;
import java.time.LocalDateTime;

@Entity
@Table(name = "ACCESS_POINT")
public class AccessPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "AP_ID")
    private Long id;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "LAST_UPDATE")
    private LocalDateTime lastUpdate;

    @Column(name = "SERVER_ADDRESS")
    private InetAddress serverAddress;

    @Column(name = "ACTIVE")
    private Boolean active;

    public AccessPoint() {
    }

    public Long getId() {
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

    public void setId(Long ID) {
        this.id = ID;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}
