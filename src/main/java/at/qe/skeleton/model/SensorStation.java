package at.qe.skeleton.model;

import com.sun.faces.facelets.util.Path;
import jakarta.persistence.*;

import java.time.Duration;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    private User gardener;

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

    public User getGardener() {
        return gardener;
    }
}
