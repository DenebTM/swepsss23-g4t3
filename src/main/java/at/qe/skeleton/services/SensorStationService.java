package at.qe.skeleton.services;

import at.qe.skeleton.models.Measurement;
import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.repositories.SensorStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SensorStationService {

    @Autowired
    SensorStationRepository ssRepository;

    /**
     * Route to GET all sensor stations
     * @return List of all sensor stations
     */
    public Collection<SensorStation> getAllSS() {
        return ssRepository.findAll();
    }

    /**
     * Loads a single sensor station identified by its id.
     *
     * @param id the id of sensor station to search for
     * @return the sensor station with the given id
     */
    public SensorStation loadSSById(Integer id) {
        return ssRepository.findFirstById(id);
    }

    /**
     * Loads all sensor stations connected to a specified access point
     * 
     * @param apName name of access point
     * @return sensor stations belonging to access point with given name
     */
    public Collection<SensorStation> getSSForAccessPoint(String apName) {
        return ssRepository.findByApName(apName);
    }

    /**
     * saves a sensor station into database
     * @param ss the sensor station to save
     * @return the saved sensor station
     */
    public SensorStation saveSS(SensorStation ss){ return ssRepository.save(ss);}

    /**
     * function to delete a sensor station
     * @param ss to delete
     */
    public void deleteSS(SensorStation ss) {
        ssRepository.delete(ss);
    }

    /**
     * getting a list of usernames of all gardeners assigned to a single sensor station
     * @param ss
     * @return list of usernames
     */
    public List<String> getGardenersBySS(SensorStation ss){
        return ss.getGardeners().stream().map(Userx::getUsername).collect(Collectors.toList());
    }

    public ArrayList<Measurement> getMeasurements(Integer ssId, Instant from, Instant to){
        ArrayList<Measurement> measurements = new ArrayList<>();
        // return a List of all Measurements in teh given time frame [from, to]
        // if there are no Measurements return empty List
        return measurements;
    }

    public Measurement getCurrentMeasurement(Integer ssId) {
        Measurement measurement=null;
        // return the most recent/current Measurements for sensor station with id = ssId
        // if there are no Measurements yet return null
        return measurement;
    }

    public Object getAllCurrentMeasurements(){
        // return an object containing the returned measurements indexed by sensor station
        return null;
    }
}
