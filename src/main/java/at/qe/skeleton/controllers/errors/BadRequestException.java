package at.qe.skeleton.controllers.errors;

/**
 * 400 BAD REQUEST
 */
public class BadRequestException extends RuntimeException {
  public BadRequestException(String message) {
    super(message);
  }
}
