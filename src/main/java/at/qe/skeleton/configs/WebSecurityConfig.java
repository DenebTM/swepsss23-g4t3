package at.qe.skeleton.configs;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import at.qe.skeleton.configs.jwtutils.CustomAuthEntryPoint;
import at.qe.skeleton.configs.jwtutils.JwtFilter;

/**
 * Spring configuration for web security.
 *
 * This class is part of the skeleton project provided for students of the
 * course "Software Engineering" offered by the University of Innsbruck.
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {

        http.cors().and();

        http.csrf().disable();

        // Needed for H2 console
        http.headers().frameOptions().disable();

        http.logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .invalidateHttpSession(true)
                .deleteCookies("AUTH_JWT")
                .logoutSuccessUrl("/login");

        // Disable built-in Spring Security session management
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and();

        http.authorizeHttpRequests()
                // Allow access point to advertise self
                .requestMatchers(HttpMethod.POST, "/api/access-points")
                .permitAll()

                // Allow visitors to new the gallery and upload photos
                .requestMatchers(HttpMethod.GET, "/api/sensor-stations/**")
                .permitAll()
                .requestMatchers(HttpMethod.POST, "/api/sensor-stations/*/photos")
                .permitAll()

                // Allow authorized access to other API routes
                .requestMatchers("/api/**")
                .hasAnyAuthority("ADMIN", "GARDENER", "USER")

                // Allow access to all for all other requests (assets, errors, etc.)
                .anyRequest().permitAll();

        http.exceptionHandling()
                .authenticationEntryPoint(new CustomAuthEntryPoint());

        // Add JWT filter for authentication
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth, DataSource dataSource) throws Exception {
        // Configure roles and passwords via datasource
        auth.jdbcAuthentication().dataSource(dataSource)
                .usersByUsernameQuery("select username, password, 1 from userx where username=?")
                .authoritiesByUsernameQuery("select username, user_role from userx where username=?");
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}
