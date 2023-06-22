package at.qe.skeleton.controllers.errors;

/**
 * 404 NOT FOUND
 */
public class NotFoundInDatabaseException extends RuntimeException {

    public NotFoundInDatabaseException(String entity, Object id) {
        super(entity + " " + id.toString() + " not found in database!");
    }

}
