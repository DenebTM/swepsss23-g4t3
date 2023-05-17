package at.qe.skeleton.configs.logging;

import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerMapping;

import at.qe.skeleton.models.enums.LogEntityType;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class MDCSensorStationEntityFilter extends MDCAbstractEntityFilter {

    @Override
    protected LogEntityType entityType() {
        return LogEntityType.SENSOR_STATION;
    }

    @Override
    protected Object entityId(HttpServletRequest request) {
        // get access to the `id` in `/sensor-station/{id}`
        @SuppressWarnings("unchecked")
        Map<String, String> pathVariables =
            (Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE); 

        if (pathVariables != null) {
            return pathVariables.get("id");
        }

        return null;
    }

}
