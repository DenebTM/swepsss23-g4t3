package at.qe.skeleton.models;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.AllArgsConstructor;
import lombok.Getter;

@JsonSerialize
@AllArgsConstructor
@Getter
public class PostAccessPointResponse {

    @JsonUnwrapped
    private final AccessPoint ap;

    private final String token;

}
