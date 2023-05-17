package at.qe.skeleton.configs.logging;

import java.io.IOException;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import at.qe.skeleton.models.enums.LogEntityType;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public abstract class MDCAbstractEntityFilter extends OncePerRequestFilter {

    protected abstract LogEntityType entityType();
    protected abstract Object entityId(HttpServletRequest request);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final var entityType = entityType();
        final var entityId = entityId(request); 
        if (entityId != null) {
            MDC.put(entityType.name(), entityId.toString());
        }

        filterChain.doFilter(request, response);   
    }

}
