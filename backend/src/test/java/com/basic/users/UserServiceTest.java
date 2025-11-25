package com.basic.users;

import com.basic.auth.AccessCheck;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AccessCheck accessCheck;

    @InjectMocks
    private UserService userService;

    private AutoCloseable closeable;

    @BeforeEach
    void setup() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void close() throws Exception {
        closeable.close();
    }

    @Test
    void loadUserByUsername_shouldReturnUserDetails() {
        UserModel user = new UserModel();
        user.setEmail("mail@mail.com");
        user.setPassword("PASS");
        user.setRole(UserRole.USER);

        when(userRepository.findByEmail("mail@mail.com"))
                .thenReturn(Optional.of(user));

        UserDetails details = userService.loadUserByUsername("mail@mail.com");

        assertEquals("mail@mail.com", details.getUsername());
        assertEquals("PASS", details.getPassword());
        assertTrue(details.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("USER")));
    }

    @Test
    void loadUserByUsername_shouldThrowWhenNotFound() {
        when(userRepository.findByEmail("no@mail.com"))
                .thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> userService.loadUserByUsername("no@mail.com"));
    }


    @Test
    void addUser_shouldSaveUser() {
        UserRequest request = new UserRequest();
        request.setEmail("abc@mail.com");
        request.setPassword("pass");

        when(passwordEncoder.encode("pass")).thenReturn("ENC");
        when(userRepository.save(any(UserModel.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        UserResponse response = userService.addUser(request);

        assertEquals("abc@mail.com", response.getEmail());
        assertEquals("USER", response.getRole());
        verify(userRepository).save(any(UserModel.class));
    }


    @Test
    void getAllUsers_shouldReturnList() {
        UserModel u = new UserModel();
        u.setEmail("u@mail.com");
        u.setRole(UserRole.USER);

        when(userRepository.findAll()).thenReturn(List.of(u));

        List<UserResponse> result = userService.getAllUsers();

        assertEquals(1, result.size());
        assertEquals("u@mail.com", result.get(0).getEmail());
    }


    @Test
    void getUserById_shouldReturnUser() {
        UUID id = UUID.randomUUID();
        UserModel user = new UserModel();
        user.setId(id);
        user.setEmail("test@mail.com");
        user.setRole(UserRole.USER);

        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        UserResponse response = userService.getUserById(id);

        assertEquals(id, response.getId());
    }

    @Test
    void getUserById_shouldThrowIfNotFound() {
        UUID id = UUID.randomUUID();

        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserById(id));
    }

    @Test
    void updateUser_shouldUpdateWhenOwner() {
        UUID id = UUID.randomUUID();

        UserModel current = new UserModel();
        current.setId(id);

        UserModel dbUser = new UserModel();
        dbUser.setId(id);
        dbUser.setEmail("OLD");
        dbUser.setRole(UserRole.USER);

        UserRequest req = new UserRequest();
        req.setEmail("NEW");
        req.setPassword("pass");
        req.setRole("ADMIN");

        when(accessCheck.currentUser()).thenReturn(current);
        when(accessCheck.isAdmin()).thenReturn(true);
        when(userRepository.findById(id)).thenReturn(Optional.of(dbUser));
        when(passwordEncoder.encode("pass")).thenReturn("ENC");
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        UserResponse result = userService.updateUser(id, req);

        assertEquals("NEW", result.getEmail());
        assertEquals("ADMIN", result.getRole());
    }

    @Test
    void updateUser_shouldThrowIfNotOwner() {
        UUID id = UUID.randomUUID();

        UserModel current = new UserModel();
        current.setId(UUID.randomUUID());

        when(accessCheck.currentUser()).thenReturn(current);
        when(accessCheck.isAdmin()).thenReturn(false);
        when(accessCheck.isOwner()).thenReturn(false);

        UserRequest req = new UserRequest();

        assertThrows(RuntimeException.class,
                () -> userService.updateUser(id, req));
    }

    @Test
    void deleteUser_shouldDeleteWhenAuthorized() {
        UUID id = UUID.randomUUID();

        when(accessCheck.isAdmin()).thenReturn(true);

        userService.deleteUser(id);

        verify(userRepository, times(1)).deleteById(id);
    }

    @Test
    void deleteUser_shouldThrowWhenUnauthorized() {
        UUID id = UUID.randomUUID();

        when(accessCheck.isAdmin()).thenReturn(false);
        when(accessCheck.isOwner()).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.deleteUser(id));
    }
}
