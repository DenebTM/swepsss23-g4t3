package at.qe.skeleton.services;

import at.qe.skeleton.models.AccessPoint;
import at.qe.skeleton.repositories.AccessPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
     * @param name the name of the AP to search for
     * @return the access point with the given id
     */
    public AccessPoint loadAPByName(String name) {
        return apRepository.findFirstByName(name);
    }

    /**
     * saves an access point into database
     * @param ap the access point to save
     * @return the saved access point
     */
    public AccessPoint saveAP(AccessPoint ap) {
        ap.setLastUpdate(LocalDateTime.now());
        return apRepository.save(ap);
    }

    /**
     * function to delete an access point
     * @param ap to delete
     */
    public void deleteAP(AccessPoint ap) {
        apRepository.delete(ap);
    }

}
