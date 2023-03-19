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
    private Long ID;

    @Column(name = "ROOM_NAME", nullable = false)
    private String roomName;

    @Column(name = "LAST_UPDATE")
    private LocalDateTime lastUpdate;

    @OneToOne
    @JoinColumn(name = "VALUES_ID", nullable = false)
    private SensorValues lowerBound;

    @OneToOne
    @JoinColumn(name = "VALUES_ID", nullable = false)
    private SensorValues upperBound;

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

    public SensorValues getLowerBound() {
        return lowerBound;
    }

    public SensorValues getUpperBound() {
        return upperBound;
    }
}
