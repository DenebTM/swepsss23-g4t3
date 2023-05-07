package at.qe.skeleton.services;

import at.qe.skeleton.models.SensorStation;
import at.qe.skeleton.models.enums.UserRole;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.repositories.UserxRepository;
import java.util.Collection;
import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Service for accessing and manipulating user data.
 *
 * This class is part of the skeleton project provided for students of the
 * course "Software Engineering" offered by the University of Innsbruck.
 */
@Service
@Scope("application")
public class UserService {

    @Autowired
    private UserxRepository userRepository;
    @Autowired
    private SensorStationService ssService;

    /**
     * Returns a collection of all users.
     *
     * @return
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    public Collection<Userx> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Loads a single user identified by its username.
     *
     * @param username the username to search for
     * @return the user with the given username
     */
    public Userx loadUserByUsername(String username) {
        return userRepository.findFirstByUsername(username);
    }

    /**
     * Saves the user. This method will also set Userx.createDate for new
     * entities or Userx.updateDate for updated entities. The user
     * requesting this operation will also be stored as Userx.createDate
     * or Userx.updateUser respectively.
     *
     * @param userx the user to save
     * @return the updated user
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    public Userx saveUser(Userx userx) {
        if (userx.isNew()) {
            userx.setCreateDate(LocalDateTime.now());
        } else {
            userx.setUpdateDate(LocalDateTime.now());
        }
        return userRepository.save(userx);
    }

    /**
     * Deletes the user.
     *
     * @param userx the user to delete
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteUser(Userx userx) {
        Set<SensorStation> assignedSS = userx.getAssignedSS();
        for (SensorStation ss : assignedSS){
            ss.getGardeners().remove(userx);
            ssService.saveSS(ss);
        }
        userRepository.delete(userx);
    }

    public Userx getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findFirstByUsername(auth.getName());
    }

    /**
     * Function used to get the authorities (roles) of the currently logged in user
     *
     * @return A collection of {@link GrantedAuthority} objects for the logged in
     *         user
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities();
    }

    /**
     * Function used to get all sensor stations a user is assigned to
     * @param gardener
     * @return List of assigned sensor stations
     */
    public Collection<SensorStation> getAssignedSS(Userx gardener) {
        return gardener.getAssignedSS();
    }

    /**
     * Function to use in controllers if statement to check authenticated users permissions
     * @return TRUE if auth. user has only role user, if gardener or admin return FALSE
     */
    public Boolean authRoleIsUser(){
        return getAuthenticatedUser().getUserRole() == UserRole.USER;
    }
    public Boolean roleIsUser(Userx user){
        return user.getUserRole() == UserRole.USER;
    }

    /**
     * Function to use in controllers if statement to check authenticated users permissions
     * @return TRUE if auth. user has only role gardener, if admin return FALSE
     */
    public Boolean authRoleIsGardener(){
        return getAuthenticatedUser().getUserRole() == UserRole.GARDENER;
    }

    /**
     * Function to use in controllers if statement to check authenticated users permissions
     * @return TRUE if auth. user has role admin, if not return FALSE
     */
    public Boolean authRoleIsAdmin(){
        return getAuthenticatedUser().getUserRole() == UserRole.ADMIN;
    }

    /**
     * Function used when setting a new password to check if it's empty or not
     * @param password
     * @return True if password is invalid, false if not
     */
    public Boolean isNotValidPassword(String password) {
        return (password == null || password.equals(""));
    }
}
