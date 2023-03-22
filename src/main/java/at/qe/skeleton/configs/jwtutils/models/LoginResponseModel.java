package at.qe.skeleton.configs.jwtutils.models;

import java.io.Serializable;

/**
 * Model for the response from the login route {@link LoginController}
 * The response returns the generated JWT for the user who just logged in to the
 * frontend
 * Heavily based on this tutorial:
 * https://www.tutorialspoint.com/spring_security/spring_security_with_jwt.htm
 */
public class LoginResponseModel implements Serializable {
    private static final long serialVersionUID = 1L;
    private final String token;

    /**
     * @param token The JWT returned from the login request
     */
    public LoginResponseModel(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}