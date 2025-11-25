package com.basic.utils;

import com.basic.auth.AccessCheck;
import com.basic.users.UserModel;
import com.basic.users.UserRepository;
import org.junit.jupiter.api.*;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AccessCheckTest {

    @Mock
    private UserRepository userRepository;

    private AccessCheck accessCheck;

    private AutoCloseable closeable;

    @BeforeEach
    void setup() {
        closeable = MockitoAnnotations.openMocks(this);
        accessCheck = new AccessCheck(userRepository);
    }

    @AfterEach
    void tearDown() throws Exception {
        SecurityContextHolder.clearContext();
        closeable.close();
    }


    @Test
    void currentUser_shouldReturnUser() {
        SimpleGrantedAuthority role = new SimpleGrantedAuthority("USER");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        "email@test.com",
                        null,
                        List.of(role)
                );

        SecurityContextHolder.getContext().setAuthentication(auth);

        UserModel model = new UserModel();
        model.setEmail("email@test.com");

        when(userRepository.findByEmail("email@test.com"))
                .thenReturn(Optional.of(model));

        UserModel result = accessCheck.currentUser();

        assertNotNull(result);
        assertEquals("email@test.com", result.getEmail());
    }

    @Test
    void currentUser_shouldThrowWhenNotFound() {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        "missing@test.com",
                        null,
                        List.of(new SimpleGrantedAuthority("USER"))
                );

        SecurityContextHolder.getContext().setAuthentication(auth);

        when(userRepository.findByEmail("missing@test.com"))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> accessCheck.currentUser());
    }


    @Test
    void isAdmin_shouldReturnTrue() {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        "user@mail.com",
                        null,
                        List.of(new SimpleGrantedAuthority("ADMIN"))
                );

        SecurityContextHolder.getContext().setAuthentication(auth);

        assertTrue(accessCheck.isAdmin());
    }

    @Test
    void isAdmin_shouldReturnFalse() {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        "user@mail.com",
                        null,
                        List.of(new SimpleGrantedAuthority("USER"))
                );

        SecurityContextHolder.getContext().setAuthentication(auth);

        assertFalse(accessCheck.isAdmin());
    }

    @Test
    void isOwner_shouldReturnTrue() {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        "user@mail.com",
                        null,
                        List.of(new SimpleGrantedAuthority("OWNER"))
                );

        SecurityContextHolder.getContext().setAuthentication(auth);

        assertTrue(accessCheck.isOwner());
    }

    @Test
    void isOwner_shouldReturnFalse() {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        "user@mail.com",
                        null,
                        List.of(new SimpleGrantedAuthority("USER"))
                );

        SecurityContextHolder.getContext().setAuthentication(auth);

        assertFalse(accessCheck.isOwner());
    }

    @Test
    void isUser_shouldReturnTrue() {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        "user@mail.com",
                        null,
                        List.of(new SimpleGrantedAuthority("USER"))
                );

        SecurityContextHolder.getContext().setAuthentication(auth);

        assertTrue(accessCheck.isUser());
    }

    @Test
    void isUser_shouldReturnFalse() {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        "user@mail.com",
                        null,
                        List.of(new SimpleGrantedAuthority("ADMIN"))
                );

        SecurityContextHolder.getContext().setAuthentication(auth);

        assertFalse(accessCheck.isUser());
    }
}
