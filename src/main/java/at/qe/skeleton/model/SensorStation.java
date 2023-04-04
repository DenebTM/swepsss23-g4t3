package at.qe.skeleton.model;

import at.qe.skeleton.controllers.api.views.SSView;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "SENSOR_STATION")
@JsonView(SSView.class)
public class SensorStation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "SS_ID")
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "AP_ID")
    private AccessPoint accessPoint;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS")
    private Status status;

    @JsonBackReference
    @OneToMany(mappedBy = "sensorStation",
            fetch = FetchType.EAGER,
            cascade = CascadeType.REMOVE,
            orphanRemoval = true)
    private Set<Measurement> measurements = new HashSet<>();

    @Column(name = "TRANSMISSION_INTERVAL", nullable = false)
    private Duration transmissionInterval;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER,
            cascade = CascadeType.REMOVE)
    @JoinTable(name = "GARDENER_SS",
            joinColumns = @JoinColumn(name = "SS_ID"),
            inverseJoinColumns = @JoinColumn(name = "USERNAME"))
    private Set<Userx> gardeners;

    @OneToOne
    @JoinColumn(name = "UPPER_VALUES_ID")
    private SensorValues upperBound;

    @OneToOne
    @JoinColumn(name = "LOWER_VALUES_ID")
    private SensorValues lowerBound;

    //TODO: paths are not working yet
    /*@ElementCollection
    @CollectionTable(name = "PATH", joinColumns = @JoinColumn(name = "STATION_ID"))
    @Column(name = "PHOTOS")
    public Set<Path> paths = new HashSet<>();*/

    public SensorStation() {
    }

    public Integer getId() {
        return id;
    }

    public AccessPoint getAccessPoint() {
        return accessPoint;
    }

    public Status getStatus() {
        return status;
    }

    public Set<Measurement> getMeasurements() {
        return measurements;
    }

    public Duration getTransmissionInterval() {
        return transmissionInterval;
    }

    public SensorValues getUpperBound() {
        return upperBound;
    }

    public SensorValues getLowerBound() {
        return lowerBound;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setAccessPoint(AccessPoint accessPoint) {
        this.accessPoint = accessPoint;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setMeasurements(Set<Measurement> measurements) {
        this.measurements = measurements;
    }

    public void setTransmissionInterval(Duration transmissionInterval) {
        this.transmissionInterval = transmissionInterval;
    }

    public void setUpperBound(SensorValues upperBound) {
        this.upperBound = upperBound;
    }

    public void setLowerBound(SensorValues lowerBound) {
        this.lowerBound = lowerBound;
    }

    public Set<Userx> getGardeners() {
        return gardeners;
    }

    public void setGardeners(Set<Userx> gardeners) {
        this.gardeners = gardeners;
    }
}
