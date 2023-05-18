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
 * This class runs a scheduled job that periodically checks the lastUpdate time
 * of each access point. If the access point has not communicated with the
 * backend in over 60 seconds, the status is changed to OFFLINE.
 * 
 * This is not done for UNCONFIRMED access points.
 */
@Configuration
@EnableScheduling
public class AccessPointMonitorJob {

    private final static long CHECK_INTERVAL_MS = 10 * 1000;
    private final static long AP_TIMEOUT_MS = 60 * 1000;

    @Autowired
    private AccessPointRepository apRepository;

    @Autowired
    private SensorStationRepository ssRepository;

    @Autowired
    private LoggingService logger;

    @Scheduled(initialDelay = CHECK_INTERVAL_MS, fixedDelay = CHECK_INTERVAL_MS)
    public void checkAccessPoints() {
        for (AccessPoint ap : apRepository.findAll()) {
            // ignore access points not yet approved by admin
            if (ap.getStatus().equals(AccessPointStatus.UNCONFIRMED)) break;

            if (ap.getLastUpdate().plusMillis(AP_TIMEOUT_MS).isBefore(Instant.now())) {
                for (SensorStation ss : ap.getSensorStations()) {
                    // TODO: Remove AVAILABLE stations

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

}
