package at.qe.skeleton.services;

import at.qe.skeleton.model.SensorStation;
import at.qe.skeleton.repositories.SensorStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Collection;

public class SensorStationService {

    @Autowired
    SensorStationRepository ssRepository;

    @PreAuthorize("hasAnyAuthority('ADMIN', 'GARDENER)")
    public Collection<SensorStation> getAllSS() {
        return ssRepository.findAll();
    }



}
