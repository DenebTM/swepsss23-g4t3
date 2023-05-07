package at.qe.skeleton.services;

import at.qe.skeleton.controllers.HelperFunctions;
import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.repositories.MeasurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MeasurementService {

    @Autowired
    MeasurementRepository measurementRepository;

    public Measurement getLatestMeasurementBySensorStation(SensorStation ss) {
        List<Measurement> measurements = measurementRepository.findFirstBySensorStationOrderByTimestamp(ss);
        return measurements.get(0);
    }

    public List<Measurement> getTimestampOrderedMeasurementsByInterval(SensorStation ss, LocalDateTime start, LocalDateTime end){
        return measurementRepository.findAllBySensorStationAndTimestampGreaterThanAndTimestampLessThanOrderByTimestampAsc(ss, start, end);
    }
}
