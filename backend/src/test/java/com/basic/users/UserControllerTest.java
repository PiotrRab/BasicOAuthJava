package com.basic.users;

import org.junit.jupiter.api.*;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController controller;

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
    void getAll_shouldReturnUsers() {
        when(userService.getAllUsers()).thenReturn(List.of(
                UserResponse.builder().email("a").build()
        ));

        List<UserResponse> list = controller.getAll();

        assertEquals(1, list.size());
    }

    @Test
    void addUser_shouldCallService() {
        UserRequest req = new UserRequest();
        req.setEmail("mail@mail.com");

        UserResponse resp = UserResponse.builder().email("mail@mail.com").build();

        when(userService.addUser(req)).thenReturn(resp);

        UserResponse result = controller.addUser(req);

        assertEquals("mail@mail.com", result.getEmail());
    }

    @Test
    void getById_shouldReturnUser() {
        UUID id = UUID.randomUUID();
        UserResponse resp = UserResponse.builder().id(id).build();

        when(userService.getUserById(id)).thenReturn(resp);

        UserResponse result = controller.getById(id);

        assertEquals(id, result.getId());
    }

    @Test
    void update_shouldUseService() {
        UUID id = UUID.randomUUID();
        UserRequest req = new UserRequest();

        UserResponse resp = UserResponse.builder().id(id).email("x").build();

        when(userService.updateUser(id, req)).thenReturn(resp);

        UserResponse result = controller.update(id, req);

        assertEquals("x", result.getEmail());
    }

    @Test
    void delete_shouldCallService() {
        UUID id = UUID.randomUUID();

        controller.delete(id);

        verify(userService, times(1)).deleteUser(id);
    }
}
