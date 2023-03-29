package at.qe.skeleton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ACCESS_POINT")
public class AccessPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "AP_ID")
    private Long ID;

    @Column(name = "ROOM_NAME", nullable = false)
    private String roomName;

    @Column(name = "LAST_UPDATE")
    private LocalDateTime lastUpdate;

    public AccessPoint() {
    }

    public Long getID() {
        return ID;
    }

    public String getRoomName() {
        return roomName;
    }

    public LocalDateTime getLastUpdate() {
        return lastUpdate;
    }

    public void setID(Long ID) {
        this.ID = ID;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}
