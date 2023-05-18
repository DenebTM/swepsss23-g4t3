package at.qe.skeleton.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import at.qe.skeleton.configs.logging.MDCAccessPointEntityFilter;
// import at.qe.skeleton.configs.logging.MDCSensorStationEntityFilter;
import at.qe.skeleton.configs.logging.MDCUserEntityFilter;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

   @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow cross-origin requests from React frontend on port 3000
        registry.addMapping("/**")
            .allowedMethods("*")
            .allowedOrigins("http://localhost:3000")
            .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MDCUserEntityFilter());
        registry.addInterceptor(new MDCAccessPointEntityFilter())
            // .addPathPatterns("/access-points/**")
            ;
        // registry.addInterceptor(new MDCSensorStationEntityFilter())
            // .addPathPatterns(
            //     "/access-points/**/sensor-stations/**",
            //     "/sensor-stations/**",
            //     "/sensor-stations/**/**"
            // )
            ;
    }

}
