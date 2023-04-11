package at.qe.skeleton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MEASUREMENT")
public class Measurement {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "TIMESTAMP")
    private LocalDateTime timestamp;

    @OneToOne
    @JoinColumn(name = "VALUES_ID")
    private SensorValues sensorValues;

    @JsonIgnore
    @ManyToOne(optional = false)
    private SensorStation sensorStation;

    public Measurement(LocalDateTime timestamp, SensorValues sensorValues, SensorStation sensorStation) {
        this.timestamp = timestamp;
        this.sensorValues = sensorValues;
        this.sensorStation = sensorStation;
    }

    public Integer getId() {
        return id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public SensorValues getSensorValues() {
        return sensorValues;
    }

    public SensorStation getSensorStation() {
        return sensorStation;
    }

    public void setSensorStation(SensorStation sensorStation) {
        this.sensorStation = sensorStation;
    }
}
