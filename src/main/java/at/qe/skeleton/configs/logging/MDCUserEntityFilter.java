package at.qe.skeleton.configs.logging;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import at.qe.skeleton.models.enums.LogEntityType;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class MDCUserEntityFilter extends MDCAbstractEntityFilter {

    @Override
    protected LogEntityType entityType() {
        return LogEntityType.USER;
    }

    @Override
    protected Object entityId(HttpServletRequest request) {
        final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            return auth.getName();
        }

        return null;
    }

}
