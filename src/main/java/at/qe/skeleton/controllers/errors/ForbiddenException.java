package at.qe.skeleton.controllers.errors;

/**
 * 403 FORBIDDEN
 */
public class ForbiddenException extends RuntimeException {
  public ForbiddenException(String message) {
    super(message);
  }
}
