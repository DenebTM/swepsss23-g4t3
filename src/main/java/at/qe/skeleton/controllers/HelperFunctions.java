package at.qe.skeleton.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class HelperFunctions {

    public ResponseEntity<Object> notFoundError(String object, String id) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(object + " \"" + id + "\" does not exist.");
    }


}
