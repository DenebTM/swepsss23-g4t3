package at.qe.skeleton.services;

import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.MeasurementRepository;
import at.qe.skeleton.repositories.SensorStationRepository;
import at.qe.skeleton.repositories.SensorValuesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MeasurementService {

    @Autowired
    MeasurementRepository measurementRepository;

    @Autowired
    SensorStationRepository ssRepository;

    @Autowired
    SensorValuesRepository sensorValuesRepository;

    public List<Measurement> getMeasurements(Integer ssId, Instant from, Instant to) {
        SensorStation ss = ssRepository.findFirstBySsID(ssId);
        return measurementRepository.
            findAllBySensorStationAndTimestampGreaterThanEqualAndTimestampLessThanEqualOrderByTimestampAsc(ss, from, to);
    }

    public Measurement getCurrentMeasurement(Integer ssId) {
        SensorStation ss = ssRepository.findFirstBySsID(ssId);
        List<Measurement> measurements = measurementRepository.findFirstBySensorStationOrderByTimestampDesc(ss);
        if (!measurements.isEmpty()) {
            return measurements.get(0);
        }
        return null;
    }

    public Map<Integer, Measurement> getAllCurrentMeasurements() {
        Collection<SensorStation> sensorStations = ssRepository.findAll();
        Map<Integer, Measurement> result = new HashMap<>(sensorStations.size());

        for (SensorStation ss : sensorStations) {
            result.put(ss.getSsID(), getCurrentMeasurement(ss.getSsID()));
        }

        return result;
    }

    public Object getMeasurementById(Integer id) {
        return measurementRepository.findFirstById(id);
    }

    public Measurement saveMeasurement(Measurement m) {
        if (m.getData() == null) {
            throw new IllegalArgumentException("Sensor values must be provided");
        }

        if (measurementRepository.findFirstBySensorStationAndTimestamp(
            m.getSensorStation(), 
            m.getTimestamp()) != null
        ) {
            throw new IllegalArgumentException("Measurement with identical timestamp already exists for sensor station");
        }

        m.setData(sensorValuesRepository.save(m.getData()));

        return measurementRepository.save(m);
    }

}
