package at.qe.skeleton.controllers;

import at.qe.skeleton.configs.jwtutils.JwtManager;
import at.qe.skeleton.configs.jwtutils.models.LoginRequestModel;
import at.qe.skeleton.configs.jwtutils.models.LoginResponseModel;
import at.qe.skeleton.controllers.errors.BadRequestException;
import at.qe.skeleton.models.Userx;
import at.qe.skeleton.repositories.UserxRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.Objects;

@SpringBootTest
@WebAppConfiguration
public class LoginControllerTest {

    @Autowired
    LoginController loginController;

    @Autowired
    JwtManager jwtManager;

    @Autowired
    UserxRepository userxRepository;

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testCorrectLogin() {
        Userx admin = userxRepository.findFirstByUsername("admin");

        LoginRequestModel model = new LoginRequestModel("admin", "passwd");
        ResponseEntity<LoginResponseModel> response = loginController.createToken(model);

        Assertions.assertTrue(jwtManager.validateJwtToken(Objects.requireNonNull(response.getBody()).getToken(), admin));
    }

    @Test
    void testIncorrectLogin() {
        LoginRequestModel invalidModel = new LoginRequestModel("invalidUser", "invalidPassword");
        LoginRequestModel modelWithNoUsername = new LoginRequestModel(null, "pwd");
        LoginRequestModel modelWithNoPassword = new LoginRequestModel("name", null);

        Assertions.assertThrows(Exception.class, () -> loginController.createToken(invalidModel));

        Assertions.assertThrows(BadRequestException.class, () -> loginController.createToken(null));
        Assertions.assertThrows(BadRequestException.class, () -> loginController.createToken(modelWithNoUsername));
        Assertions.assertThrows(BadRequestException.class, () -> loginController.createToken(modelWithNoPassword));
    }
}
