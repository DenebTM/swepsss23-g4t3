package at.qe.skeleton.configs.jwtutils;

import java.io.IOException;
import java.util.Set;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import at.qe.skeleton.model.Userx;
import at.qe.skeleton.repositories.UserxRepository;
import io.jsonwebtoken.ExpiredJwtException;

/**
 * Custom OncePerRequestFilter filter to validate the JWT sent along with
 * requests to the API
 * Heavily based on this tutorial:
 * https://www.tutorialspoint.com/spring_security/spring_security_with_jwt.htm
 */
@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private UserxRepository userxRepository;

    @Autowired
    private JwtManager tokenManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var logger = LogFactory.getLog(getClass());

        String tokenHeader = request.getHeader("Authorization");
        String username = null;
        String token = null;
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
            token = tokenHeader.substring(7);
            try {
                username = tokenManager.getUsernameFromToken(token);
            } catch (ExpiredJwtException e) {
                // This is an info message, not an error, as the user should be redirected to 
                // log in again
                logger.info("JWT has expired");
            }
        } else {
            // If Authorization: Bearer [token] is not in the headers. This is a debug
            // message, not an error, as for the login route no authorization token should
            // be sent
            logger.info("Bearer String not found in token");
        }

        if (null != username && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Authenticate the user and save this in theSecurityContextHolder
            Userx userx = userxRepository.findFirstByUsername(username);
            if (tokenManager.validateJwtToken(token, userx)) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        username, null,
                        // Convert the user role to a granted authority
                        Set.of(new SimpleGrantedAuthority(userx.getUserRole().toString())));
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}