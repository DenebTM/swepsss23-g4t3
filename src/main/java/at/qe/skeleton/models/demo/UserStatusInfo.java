package at.qe.skeleton.models.demo;

import at.qe.skeleton.models.Userx;

/**
 * Just combines a user and its status.
 *
 * This class is part of the skeleton project provided for students of the
 * course "Software Engineering" offered by the University of Innsbruck.
 */
public class UserStatusInfo {

    private Userx userx;
    private UserStatus status = UserStatus.OFFLINE;

    public UserStatusInfo(Userx userx) {
            super();
            this.userx = userx;
    }

    public Userx getUser() {
            return userx;
    }

    public void setUser(Userx userx) {
            this.userx = userx;
    }

    public UserStatus getStatus() {
            return status;
    }

    public void setStatus(UserStatus status) {
            this.status = status;
    }

}
