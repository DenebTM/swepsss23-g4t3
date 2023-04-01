package at.qe.skeleton.services;

import at.qe.skeleton.model.SensorStation;
import at.qe.skeleton.repositories.SensorStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class SensorStationService {

    @Autowired
    SensorStationRepository ssRepository;

    /**
     * Route to GET all sensor-stations
     * @return List of all sensor-stations
     */
    public Collection<SensorStation> getAllSS() {
        return ssRepository.findAll();
    }

    /**
     * Loads a single sensor-station identified by its id.
     *
     * @param id the id of sensor-station to search for
     * @return the sensor-station with the given id
     */
    public SensorStation loadSSById(Long id) {
        return ssRepository.findFirstById(id);
    }


}
