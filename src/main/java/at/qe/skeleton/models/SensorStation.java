package at.qe.skeleton.models;

import com.fasterxml.jackson.annotation.*;
import at.qe.skeleton.models.enums.SensorStationStatus;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "SENSOR_STATION")
public class SensorStation {

    @Id
    @Column(name = "SS_ID")
    private Integer ssID;

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "name")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonProperty("apName")
    @ManyToOne(optional = false)
    @JoinColumn(name = "AP_NAME")
    private AccessPoint accessPoint;

    @Enumerated(EnumType.STRING)
    @Column(name = "SS_STATUS")
    private SensorStationStatus status;

    @OneToOne
    @JoinColumn(name = "UPPER_VALUES_ID")
    @JsonIgnoreProperties("id")
    private SensorValues upperBound;

    @OneToOne
    @JoinColumn(name = "LOWER_VALUES_ID")
    @JsonIgnoreProperties("id")
    private SensorValues lowerBound;

    @Column(name = "AGGREGATION_PERIOD", nullable = false)
    private Long aggregationPeriod = 30L;


    @JsonBackReference("ss-measurements")
    @OneToMany(mappedBy = "sensorStation",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE,
            orphanRemoval = true)
    @OrderBy("timestamp asc")
    private List<Measurement> measurements;

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "username")
    @JsonIdentityReference(alwaysAsId = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "GARDENER_SS",
            joinColumns = @JoinColumn(name = "SS_ID"),
            inverseJoinColumns = @JoinColumn(name = "USERNAME"))
    private Set<Userx> gardeners;

    @JsonBackReference("ss-photos")
    @OneToMany(mappedBy = "sensorStation",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE,
            orphanRemoval = true)
    private List<PhotoData> photos;


    public SensorStation() {
        this.measurements = new ArrayList<>();
    }

    public SensorStation(AccessPoint accessPoint, Long aggregationPeriod) {
        this();
        this.accessPoint = accessPoint;
        this.aggregationPeriod = aggregationPeriod;
    }

    public Integer getSsID() {
        return ssID;
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

    public void setSsID(Integer ssID) {
        this.ssID = ssID;
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

    public Measurement getCurrentMeasurement() {
        if (this.getMeasurements() == null || this.getMeasurements().isEmpty()) {
            return null;
        }
        return this.getMeasurements().get(this.getMeasurements().size()-1);
    }
}
