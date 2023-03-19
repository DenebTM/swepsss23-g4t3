package at.qe.skeleton.model;

import com.sun.faces.facelets.util.Path;
import jakarta.persistence.*;

import java.time.Duration;
import java.util.List;

@Entity
@Table(name = "SENSOR_STATION")
public class SensorStation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "CONNECTED_AP")
    @OneToOne
    @JoinColumn(name = "AP_ID")
    private AccessPoint accessPoint;

    @Column(name = "STATION_STATUS")
    private StationStatus stationStatus;

    //TODO: check mappings!!!
    @Column(name = "MEASUREMENTS")
    @OneToMany(mappedBy = "SENSOR_STATION")
    private List<Measurement> measurements;

    @Column(name = "TRANSMISSION_INTERVAL", nullable = false)
    private Duration transmissionInterval;

    //TODO:check join column, user class is not yet updated
    @Column(name = "GARDENER")
    @OneToOne
    @JoinColumn(name = "USER_ID")
    private User gardener;

    //TODO:should path be own class?
    /*@Column(name = "PHOTOS")
    @OneToMany(mappedBy = "SENSOR_STATION")
    public List<Path> paths;*/

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
