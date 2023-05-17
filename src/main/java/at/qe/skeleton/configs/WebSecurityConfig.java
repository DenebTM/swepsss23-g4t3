package at.qe.skeleton.configs;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
import at.qe.skeleton.configs.logging.MDCAccessPointEntityFilter;
import at.qe.skeleton.configs.logging.MDCSensorStationEntityFilter;
import at.qe.skeleton.configs.logging.MDCUserEntityFilter;

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
                // Allow authorized access to API routes
                .requestMatchers("/api/**")
                .hasAnyAuthority("ADMIN", "GARDENER", "USER")

                // Allow access to all for all other requests (assets, errors, etc.)
                .anyRequest().permitAll();

        http.exceptionHandling()
                .authenticationEntryPoint(new CustomAuthEntryPoint());

        // Add JWT filter for authentication
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        http.addFilterAfter(new MDCUserEntityFilter(), JwtFilter.class);
        http.addFilterAfter(new MDCAccessPointEntityFilter(), MDCUserEntityFilter.class);
        http.addFilterAfter(new MDCSensorStationEntityFilter(), MDCAccessPointEntityFilter.class);

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
