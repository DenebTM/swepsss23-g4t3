package at.qe.skeleton.configs.logging;

import java.io.IOException;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import at.qe.skeleton.models.enums.LogEntityType;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Request interceptor (set up in WebMvcConfig) that adds properties to
 * Logback's Mapped Diagnostic Context (https://logback.qos.ch/manual/mdc.html)
 * for each request.
 * 
 * These properties are available in the {@code logging_entity_exception} table
 * for each log event corresponding to the request.
 */
@Component
public abstract class MDCAbstractEntityFilter implements HandlerInterceptor {

    protected abstract LogEntityType entityType();
    protected abstract Object entityId(HttpServletRequest request);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws ServletException, IOException {
        final var entityType = entityType();
        final var entityId = entityId(request); 
        if (entityId != null) {
            MDC.put(entityType.name(), entityId.toString());
        }

        return true;
    }

}
