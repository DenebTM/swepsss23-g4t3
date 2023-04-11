package at.qe.skeleton.models;

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

    public Measurement() {
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
}
