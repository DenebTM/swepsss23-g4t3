package at.qe.skeleton.ui.controllers;

import at.qe.skeleton.model.Userx;
import at.qe.skeleton.services.UserService;
import java.io.Serializable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Controller for the user detail view.
 *
 * This class is part of the skeleton project provided for students of the
 * course "Software Engineering" offered by the University of Innsbruck.
 */
@Component
@Scope("view")
public class UserDetailController implements Serializable {

    @Autowired
    private UserService userService;

    /**
     * Attribute to cache the currently displayed user
     */
    private Userx userx;

    /**
     * Sets the currently displayed user and reloads it form db. This user is
     * targeted by any further calls of
     * {@link #doReloadUser()}, {@link #doSaveUser()} and
     * {@link #doDeleteUser()}.
     *
     * @param userx
     */
    public void setUser(Userx userx) {
        this.userx = userx;
        doReloadUser();
    }

    /**
     * Returns the currently displayed user.
     *
     * @return
     */
    public Userx getUser() {
        return userx;
    }

    /**
     * Action to force a reload of the currently displayed user.
     */
    public void doReloadUser() {
        userx = userService.loadUser(userx.getUsername());
    }

    /**
     * Action to save the currently displayed user.
     */
    public void doSaveUser() {
        userx = this.userService.saveUser(userx);
    }

    /**
     * Action to delete the currently displayed user.
     */
    public void doDeleteUser() {
        this.userService.deleteUser(userx);
        userx = null;
    }

}
