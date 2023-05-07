package at.qe.skeleton.controllers.errors;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String entity, Object id) {
      super(entity + " " + id.toString() + " not found in database!");
    }
}
