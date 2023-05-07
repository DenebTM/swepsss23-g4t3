package at.qe.skeleton.controllers.errors;

public class NotFoundInDatabaseException extends RuntimeException {
    public NotFoundInDatabaseException(String entity, Object id) {
      super(entity + " " + id.toString() + " not found in database!");
    }
}
