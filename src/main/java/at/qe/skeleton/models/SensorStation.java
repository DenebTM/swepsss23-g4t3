package at.qe.skeleton.models;

import com.fasterxml.jackson.annotation.*;
import at.qe.skeleton.models.enums.Status;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "SENSOR_STATION")
public class SensorStation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "SS_ID")
    private Integer id;

    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id"
    )
    @JsonIdentityReference(alwaysAsId = true)
    @JsonProperty("apId")
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

    @Column(name = "AGGREGATION_PERIOD", nullable = false)
    private Long aggregationPeriod;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
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

    public SensorStation() {
    }

    public SensorStation(AccessPoint accessPoint, Long aggregationPeriod) {
        this.accessPoint = accessPoint;
        this.aggregationPeriod = aggregationPeriod;
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

    public Long getAggregationPeriod() {
        return aggregationPeriod;
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

    public void setAggregationPeriod(Long aggregationPeriod) {
        this.aggregationPeriod = aggregationPeriod;
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
