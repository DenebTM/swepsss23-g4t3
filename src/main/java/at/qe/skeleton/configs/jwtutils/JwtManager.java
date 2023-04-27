package at.qe.skeleton.configs.jwtutils;

import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import at.qe.skeleton.models.Userx;
import at.qe.skeleton.services.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * Class containing functions to generate and validate JSON Web Tokens (JWTs)
 * Based heavily on this tutorial:
 * https://www.tutorialspoint.com/spring_security/spring_security_with_jwt.htm
 */
@Component
public class JwtManager {
    public static final long TOKEN_VALIDITY = 10 * 60 * 60;

    /**
     * The JWT secret loaded from application.properties
     */
    @Value("${app.security.jwt.secret}")
    private String jwtSecret;

    @Autowired
    private UserService userService;

    /**
     * Generate a new JWT for the given user
     *
     * @param username The username of the user requesting a JWT
     * @return The generated JWT
     */
    public String generateJwtToken(String username) {
        Collection<? extends GrantedAuthority> userAuthorities = userService.getAuthorities();
        List<String> rolesList = userAuthorities.stream()
                .map(GrantedAuthority::toString)
                .collect(Collectors.toList());

        Map<String, Object> claims = new HashMap<>(Map.of("authorities", rolesList));

        return Jwts.builder().setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
    }

    /**
     *
     * @param token The token to validate
     * @param userx The user who sent the token
     * @return A boolean value which is true only if the token matches the user and
     *         not expired
     */
    public boolean validateJwtToken(String token, Userx userx) {
        String username = getUsernameFromToken(token);
        Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        boolean isTokenExpired = claims.getExpiration().before(new Date());
        return (username.equals(userx.getUsername()) && !isTokenExpired);
    }

    /**
     * @param token A JWT to extract the username from
     * @return The username of the corresponding user (visible under key sub)
     */
    public String getUsernameFromToken(String token) {
        final Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}