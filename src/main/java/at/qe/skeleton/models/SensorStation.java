package at.qe.skeleton.models;

import com.fasterxml.jackson.annotation.*;
import at.qe.skeleton.models.enums.SensorStationStatus;
import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "SENSOR_STATION")
public class SensorStation {

    @Id
    @Column(name = "SS_ID")
    private Integer id;

    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "name"
    )
    @JsonIdentityReference(alwaysAsId = true)
    @JsonProperty("apName")
    @ManyToOne(optional = false)
    @JoinColumn(name = "AP_NAME")
    private AccessPoint accessPoint;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS")
    private SensorStationStatus status;

    @JsonBackReference
    @OneToMany(mappedBy = "sensorStation",
            fetch = FetchType.EAGER,
            cascade = CascadeType.REMOVE,
            orphanRemoval = true)
    @OrderBy("timestamp asc")
    private List<Measurement> measurements;

    @Column(name = "AGGREGATION_PERIOD", nullable = false)
    private Long aggregationPeriod;

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "username")
    @JsonIdentityReference(alwaysAsId = true)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "GARDENER_SS",
            joinColumns = @JoinColumn(name = "SS_ID"),
            inverseJoinColumns = @JoinColumn(name = "USERNAME"))
    private Set<Userx> gardeners;

    @OneToOne
    @JoinColumn(name = "UPPER_VALUES_ID")
    @JsonIgnoreProperties("id")
    private SensorValues upperBound;

    @OneToOne
    @JoinColumn(name = "LOWER_VALUES_ID")
    @JsonIgnoreProperties("id")
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

    public SensorStationStatus getStatus() {
        return status;
    }

    public List<Measurement> getMeasurements() {
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

    public void setStatus(SensorStationStatus status) {
        this.status = status;
    }

    public void setMeasurements(List<Measurement> measurements) {
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
