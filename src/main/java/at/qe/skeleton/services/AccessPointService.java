package at.qe.skeleton.services;

import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.repositories.AccessPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class AccessPointService {
    @Autowired
    AccessPointRepository apRepository;

    /**
     * Route to GET all access points
     * @return List of all access points
     */
    public Collection<AccessPoint> getAllAP() {
        return apRepository.findAll();
    }

    /**
     * Loads a single access point identified by its id.
     *
     * @param id the id of access point to search for
     * @return the access point with the given id
     */
    public AccessPoint loadAPById(Integer id) {
        return apRepository.findFirstById(id);
    }

    /**
     * saves an access point into database
     * @param ap the access point to save
     * @return the saved access point
     */
    public AccessPoint saveAP(AccessPoint ap) {
        return apRepository.save(ap);
    }

}
