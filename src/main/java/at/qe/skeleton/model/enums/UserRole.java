package at.qe.skeleton.model.enums;

import org.springframework.security.core.GrantedAuthority;

import java.util.Set;

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
