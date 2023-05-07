package at.qe.skeleton.services;

import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.MeasurementRepository;
import at.qe.skeleton.repositories.SensorStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class MeasurementService {

    @Autowired
    MeasurementRepository measurementRepository;
    @Autowired
    SensorStationRepository ssRepository;

    public List<Measurement> getMeasurements(Integer ssId, Instant from, Instant to){
        SensorStation ss = ssRepository.findFirstById(ssId);
        return measurementRepository.
                findAllBySensorStationAndTimestampGreaterThanAndTimestampLessThanOrderByTimestampAsc(ss, from, to);
    }

    public Measurement getCurrentMeasurement(Integer ssId) {
        SensorStation ss = ssRepository.findFirstById(ssId);
        List<Measurement> measurements = measurementRepository.findFirstBySensorStationOrderByTimestamp(ss);
        if (!measurements.isEmpty()) {
            return measurements.get(0);
        }
        return null;
    }

    public List<Measurement> getAllCurrentMeasurements(){
        return measurementRepository.findAllByOrderBySensorStationAsc();
    }
}
