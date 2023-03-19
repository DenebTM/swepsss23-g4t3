package at.qe.skeleton.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MEASUREMENT")
public class Measurement {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long ID;

    @Column(name = "TIMESTAMP")
    private LocalDateTime timestamp;

    @Column(name = "DATA")
    @OneToOne
    @JoinColumn(name = "VALUES_ID")
    private SensorValues sensorValues;

    public Measurement() {
    }

    public Long getID() {
        return ID;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public SensorValues getSensorValues() {
        return sensorValues;
    }
}
