package at.qe.skeleton.models.enums;

/**
 * Enumeration of available user roles.
 *
 * Roles are to be understood as a hierarchy in this order: ADMIN, GARDENER, USER.
 * Every role has all permissions of the following role, but not vice versa.
 */
public enum UserRole {

    ADMIN,
    GARDENER,
    USER

}
