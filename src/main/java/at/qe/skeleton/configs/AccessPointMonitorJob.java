package at.qe.skeleton.configs;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.enums.AccessPointStatus;
import at.qe.skeleton.models.enums.LogEntityType;
import at.qe.skeleton.models.enums.SensorStationStatus;
import at.qe.skeleton.repositories.AccessPointRepository;
import at.qe.skeleton.repositories.SensorStationRepository;
import at.qe.skeleton.services.LoggingService;

/**
 * This class contains scheduled jobs for monitoring and cleanup
 */
@Configuration
@EnableScheduling
public class AccessPointMonitorJob {

    private static final long CHECK_INTERVAL_MS = 10 * 1000L;
    private static final long AP_TIMEOUT_MS = 60 * 1000L;

    @Autowired
    private AccessPointRepository apRepository;

    @Autowired
    private SensorStationRepository ssRepository;

    @Autowired
    private LoggingService logger;

    /**
     * Periodically check if confirmed access points are still communicating
     * with the backend
     * 
     * If an access point has not communicated with the backend in 60 seconds,
     * its status is set to offline.
     */
    @Scheduled(initialDelay = CHECK_INTERVAL_MS, fixedDelay = CHECK_INTERVAL_MS)
    public void checkAccessPoints() {
        for (AccessPoint ap : apRepository.findAllByStatusNot(AccessPointStatus.UNCONFIRMED)) {
            if (ap.getLastUpdate().plusMillis(AP_TIMEOUT_MS).isBefore(Instant.now())) {
                for (SensorStation ss : ap.getSensorStations()) {
                    SensorStationStatus oldSsStatus = ss.getStatus();
                    SensorStationStatus newSsStatus = SensorStationStatus.OFFLINE;

                    ss.setStatus(newSsStatus);
                    ssRepository.save(ss);

                    if (!oldSsStatus.equals(newSsStatus)) {
                        logger.warn("Sensor station status changed to " + newSsStatus.name(), LogEntityType.SENSOR_STATION, ss.getSsID(), getClass());
                    }
                }

                AccessPointStatus oldApStatus = ap.getStatus();
                AccessPointStatus newApStatus = AccessPointStatus.OFFLINE;

                ap.setStatus(AccessPointStatus.OFFLINE);
                apRepository.save(ap);

                if (!oldApStatus.equals(newApStatus)) {
                    logger.warn("Access point status changed to " + newApStatus.name(), LogEntityType.ACCESS_POINT, ap.getName(), getClass());
                }
            }
        }
    }

    /**
     * Periodically remove AVAILABLE sensor stations from access points that
     * are no longer in SEARCHING mode
     */
    @Scheduled(initialDelay = CHECK_INTERVAL_MS, fixedDelay = CHECK_INTERVAL_MS)
    public void pruneAvailableStations() {
        for (AccessPoint ap : apRepository.findAllByStatusNot(AccessPointStatus.SEARCHING)) {
            for (SensorStation ss :
                    ap.getSensorStations().stream()
                    .filter(s -> s.getStatus().equals(SensorStationStatus.AVAILABLE))
                    .toList()
            ) {
                ssRepository.delete(ss);
            }
        }
    }

}
