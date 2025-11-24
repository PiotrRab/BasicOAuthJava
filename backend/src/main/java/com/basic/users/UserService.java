package com.basic.users;

import com.basic.auth.AccessCheck;
import com.basic.auth.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccessCheck accessCheck;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        String password = user.getPassword() != null ? user.getPassword() : "";
        return User.builder()
                .username(user.getEmail())
                .password(password)
                .authorities(new SimpleGrantedAuthority(user.getRole().name()))
                .build();
    }

    public UserResponse addUser(UserRequest request) {
        UserModel user = new UserModel();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        userRepository.save(user);
        return mapToResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(UUID id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    public UserResponse updateUser(UUID id, UserRequest request) {
        UserModel currentUser = accessCheck.currentUser();
        boolean authorized = accessCheck.isAdmin() || accessCheck.isOwner();

        if (!currentUser.getId().equals(id) || !authorized) {
            throw new RuntimeException("You can only update your own account.");
        }

        UserModel user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.valueOf(request.getRole().toUpperCase()));

        return mapToResponse(userRepository.save(user));
    }

    public void deleteUser(UUID id) {
        boolean authorized = accessCheck.isAdmin() || accessCheck.isOwner();
        if (!authorized) throw new RuntimeException("You are not authorized to delete this user.");
        userRepository.deleteById(id);
    }

    private UserResponse mapToResponse(UserModel user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
