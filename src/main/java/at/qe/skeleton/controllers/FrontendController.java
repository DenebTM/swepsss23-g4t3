package at.qe.skeleton.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Redirects frontend pages to "/"
 * Needed so that React router works with Spring Boot
 * Requires 'spring.mvc.pathmatch.matching-strategy=ant-path-matcher' in application.properties
 * Source: https://stackoverflow.com/questions/47689971/how-to-work-with-react-routers-and-spring-boot-controller
 */
@Controller
public class FrontendController {

    @GetMapping(value = { "/", "/{x:[\\w\\-]+}", "/{x:^(?!api$).*$}/**/{y:[\\w\\-]+}" })
    public String getIndex(HttpServletRequest request) {
        return "/index.html";
    }
  
}
