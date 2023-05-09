package at.qe.skeleton.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Table(name = "MEASUREMENT")
public class Measurement {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "TIMESTAMP")
    private Instant timestamp;

    @OneToOne
    @JoinColumn(name = "VALUES_ID")
    private SensorValues data;

    @JsonIgnore
    @ManyToOne(optional = false)
    private SensorStation sensorStation;

    public Measurement(Instant timestamp, SensorValues sensorValues, SensorStation sensorStation) {
        this.timestamp = timestamp;
        this.data = sensorValues;
        this.sensorStation = sensorStation;
    }

    public Integer getId() {
        return id;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public SensorValues getData() {
        return data;
    }

    public SensorStation getSensorStation() {
        return sensorStation;
    }

    public void setSensorStation(SensorStation sensorStation) {
        this.sensorStation = sensorStation;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public void setData(SensorValues data) {
        this.data = data;
    }
}
