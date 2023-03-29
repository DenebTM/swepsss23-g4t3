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

    @Column(name = "ROOM_NAME", nullable = false)
    private String roomName;

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

    public String getRoomName() {
        return roomName;
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

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}
