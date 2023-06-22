package at.qe.skeleton.configs.jwtutils.models;
import java.io.Serializable;

/**
 * Model for the expected POST body sent to the login route
 * {@link LoginController}
 * Heavily based on this tutorial:
 * https://www.tutorialspoint.com/spring_security/spring_security_with_jwt.htm
 */
public class LoginRequestModel implements Serializable {

    private static final long serialVersionUID = 2636936156391265891L;
    private String username;
    private String password;

    public LoginRequestModel() {
    }

    public LoginRequestModel(String username, String password) {
        super();
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
