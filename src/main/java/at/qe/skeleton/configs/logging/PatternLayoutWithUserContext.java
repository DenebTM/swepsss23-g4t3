package at.qe.skeleton.configs.logging;

import ch.qos.logback.classic.PatternLayout;

/**
 * Create a %user variable that can be used by Logback patterns.
 * 
 * Heavily based on https://www.codelord.net/2010/08/27/logging-with-a-context-users-in-logback-and-spring-security/
 */
public class PatternLayoutWithUserContext extends PatternLayout {

    static {
        PatternLayout.DEFAULT_CONVERTER_MAP.put(
            "user",
            UserConverter.class.getName()
        );
    }

}
