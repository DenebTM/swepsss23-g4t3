package at.qe.skeleton.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Redirects frontend pages to "/"
     * Needed to so that React router works with Spring Boot
     * Requires 'spring.mvc.pathmatch.matching-strategy=ant-path-matcher' in application.properties
     * Source:https://stackoverflow.com/questions/39331929/spring-catch-all-route-for-index-html/42998817#42998817
     */

    // Routes that must be routed directly to Spring in order for things to work correctly
    String nonReactRoutes = "api|handle-login|assets|logout|h2-console";
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring_:(?!(?:%s))\\w+}".formatted(nonReactRoutes))
           .setViewName("forward:/");
        registry.addViewController("/{spring_:(?!(?:%s))\\w+}/{spring:\\w+}".formatted(nonReactRoutes))
            .setViewName("forward:/");
        registry.addViewController("/{spring_:(?!(?:%s))\\w+}/**{spring:?!(\\.js|\\.css)$}".formatted(nonReactRoutes))
            .setViewName("forward:/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow cross-origin requests from React frontend on port 3000
        registry.addMapping("/**").allowedMethods("*").allowedOrigins("http://localhost:3000").allowCredentials(true);
    }

}