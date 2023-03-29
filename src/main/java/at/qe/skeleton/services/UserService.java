package at.qe.skeleton.services;

import at.qe.skeleton.model.Userx;
import at.qe.skeleton.repositories.UserxRepository;
import java.util.Collection;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Service for accessing and manipulating user data.
 *
 * This class is part of the skeleton project provided for students of the
 * course "Software Engineering" offered by the University of Innsbruck.
 */
@Component
@Scope("application")
public class UserService {

    @Autowired
    private UserxRepository userRepository;

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
    @PreAuthorize("hasAuthority('ADMIN') or principal.username eq #username")
    public Userx loadUser(String username) {
        return userRepository.findFirstByUsername(username);
    }

    /**
     * Saves the user. This method will also set {@link Userx#createDate} for new
     * entities or {@link Userx#updateDate} for updated entities. The user
     * requesting this operation will also be stored as {@link Userx#createDate}
     * or {@link Userx#updateUser} respectively.
     *
     * @param user the user to save
     * @return the updated user
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    public Userx saveUser(Userx user) {
        if (user.isNew()) {
            user.setCreateDate(LocalDateTime.now());
            user.setCreateUser(getAuthenticatedUser());
        } else {
            user.setUpdateDate(LocalDateTime.now());
            user.setUpdateUser(getAuthenticatedUser());
        }
        return userRepository.save(user);
    }

    /**
     * Deletes the user.
     *
     * @param user the user to delete
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteUser(Userx user) {
        userRepository.delete(user);
        // :TODO: write some audit log stating who and when this user was permanently deleated.
    }

    private Userx getAuthenticatedUser() {
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

}
