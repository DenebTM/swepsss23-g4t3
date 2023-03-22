package at.qe.skeleton.model;

import jakarta.persistence.*;

import java.time.Duration;
import java.util.List;

@Entity
@Table(name = "SENSOR_STATION")
public class SensorStation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "STATION_ID")
    private Long id;

    @OneToOne
    @JoinColumn(name = "AP_ID")
    private AccessPoint accessPoint;

    @Column(name = "STATION_STATUS")
    private StationStatus stationStatus;

    //TODO: check mappings!!!
    @Column(name = "MEASUREMENTS")
    @OneToMany
    private List<Measurement> measurements;

    @Column(name = "TRANSMISSION_INTERVAL", nullable = false)
    private Duration transmissionInterval;

    //TODO:check join column, user class is not yet updated
    @OneToOne
    @JoinColumn(name = "USER_ID")
    private Userx gardener;

    @ManyToOne
    @JoinColumn(name = "VALUES_ID", insertable=false, updatable=false)
    private SensorValues upperBound;

    @ManyToOne
    @JoinColumn(name = "VALUES_ID", insertable=false, updatable=false)
    private SensorValues lowerBound;

    //TODO: paths are not working yet
    /*@ElementCollection
    @CollectionTable(name = "PATH", joinColumns = @JoinColumn(name = "STATION_ID"))
    @Column(name = "PHOTOS")
    public Set<Path> paths = new HashSet<>();*/

    public SensorStation() {
    }

    public Long getId() {
        return id;
    }

    public AccessPoint getAccessPoint() {
        return accessPoint;
    }

    public StationStatus getStationStatus() {
        return stationStatus;
    }

    public List<Measurement> getMeasurements() {
        return measurements;
    }

    public Duration getTransmissionInterval() {
        return transmissionInterval;
    }

    public Userx getGardener() {
        return gardener;
    }
}
