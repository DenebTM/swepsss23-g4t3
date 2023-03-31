package at.qe.skeleton.services;

import at.qe.skeleton.model.AccessPoint;
import at.qe.skeleton.repositories.AccessPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class AccessPointService {
    @Autowired
    AccessPointRepository apRepository;

    public Collection<AccessPoint> getAllAP() {
        return apRepository.findAll();
    }

    public AccessPoint loadAPById(Long id) {
        return apRepository.findFirstById(id);
    }


}
