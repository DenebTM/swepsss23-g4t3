package at.qe.skeleton.controllers.api;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Set the base path for API requests to /api
 * as per https://stackoverflow.com/a/38228080 ("Option 2")
 * All RestControllers should extend this class
 */

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public interface BaseRestController { }
