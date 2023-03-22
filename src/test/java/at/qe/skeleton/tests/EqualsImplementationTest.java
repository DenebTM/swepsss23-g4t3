package at.qe.skeleton.tests;

import at.qe.skeleton.model.Userx;
import at.qe.skeleton.model.UserRole;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;
import org.junit.jupiter.api.Test;

/**
 * Tests to ensure that each entity's implementation of equals conforms to the
 * contract. See {@linkplain {http://www.jqno.nl/equalsverifier/}} for more
 * information.
 *
 * This class is part of the skeleton project provided for students of the
 * course "Software Engineering" offered by the University of Innsbruck.
 */
public class EqualsImplementationTest {

    @Test
    public void testUserEqualsContract() {
        Userx userx1 = new Userx();
        userx1.setUsername("user1");
        Userx userx2 = new Userx();
        userx2.setUsername("user2");
        EqualsVerifier.forClass(Userx.class).withPrefabValues(Userx.class, userx1, userx2).suppress(Warning.STRICT_INHERITANCE, Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    public void testUserRoleEqualsContract() {
        EqualsVerifier.forClass(UserRole.class).verify();
    }

}