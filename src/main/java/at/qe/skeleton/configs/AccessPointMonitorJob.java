package at.qe.skeleton.configs;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.enums.AccessPointStatus;
import at.qe.skeleton.models.enums.SensorStationStatus;
import at.qe.skeleton.repositories.AccessPointRepository;
import at.qe.skeleton.repositories.SensorStationRepository;

@Configuration
@EnableScheduling
public class AccessPointMonitorJob {

    private final static long CHECK_INTERVAL_MS = 10 * 1000;
    private final static long AP_TIMEOUT_MS = 60 * 1000;

    @Autowired
    private AccessPointRepository apRepository;

    @Autowired
    private SensorStationRepository ssRepository;

    @Scheduled(initialDelay = CHECK_INTERVAL_MS, fixedDelay = CHECK_INTERVAL_MS)
    public void checkAccessPoints() {
        for (AccessPoint ap : apRepository.findAll()) {
            if (ap.getLastUpdate().plusSeconds(AP_TIMEOUT_MS).isBefore(Instant.now())) {
                for (SensorStation ss : ap.getSensorStations()) {
                    ss.setStatus(SensorStationStatus.OFFLINE);
                    ssRepository.save(ss);
                }

                ap.setStatus(AccessPointStatus.OFFLINE);
                apRepository.save(ap);
            }
        }
    }

}
