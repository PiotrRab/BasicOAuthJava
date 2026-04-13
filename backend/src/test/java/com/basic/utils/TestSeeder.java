package com.basic.utils;

import com.basic.events.EventModel;
import com.basic.events.EventRepository;
import com.basic.guests.GuestModel;
import com.basic.guests.GuestRepository;
import com.basic.tags.TagModel;
import com.basic.tags.TagRepository;
import com.basic.users.UserModel;
import com.basic.users.UserRepository;
import com.basic.users.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TestSeeder {

    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final GuestRepository guestRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void seed() {
        // Czyścimy bazę
        eventRepository.deleteAll();
        guestRepository.deleteAll();
        tagRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Tworzymy dwóch użytkowników (dla testów izolacji)
        UserModel user1 = createUser("user1@test.com", "password123", UserRole.USER);
        UserModel user2 = createUser("user2@test.com", "password123", UserRole.USER);
        UserModel admin = createUser("admin@test.com", "admin123", UserRole.ADMIN);

        // 2. Tagi dla User 1
        TagModel tagFamily = createTag("Rodzina", user1);
        TagModel tagFriends = createTag("Znajomi", user1);
        TagModel tagVege = createTag("Wegetarianin", user1);
        TagModel tagVip = createTag("VIP", user1);
        TagModel tagHotel = createTag("Nocleg", user1);

        // Tagi dla User 2 (izolacja)
        createTag("Praca", user2);
        createTag("Rodzina", user2);

        // 3. Goście dla User 1
        GuestModel guest1 = createGuest("Jan", "Kowalski", user1, List.of(tagFamily, tagHotel));
        GuestModel guest2 = createGuest("Anna", "Nowak", user1, List.of(tagFriends, tagVege));
        GuestModel guest3 = createGuest("Marek", "Zieliński", user1, List.of(tagFriends, tagVip, tagHotel));
        GuestModel guest4 = createGuest("Zofia", "Biała", user1, List.of(tagFamily));
        GuestModel guest5 = createGuest("Piotr", "Czarny", user1, List.of(tagFriends));

        // Goście dla User 2
        createGuest("Tomasz", "Inny", user2, List.of());

        // 4. Wydarzenia dla User 1
        createEvent("Wesele", "2025-06-20", user1, List.of(guest1, guest2, guest3, guest4, guest5));
        createEvent("Poprawiny", "2025-06-21", user1, List.of(guest1, guest2, guest3));
        createEvent("Wieczór Kawalerski", "2025-05-30", user1, List.of(guest3, guest5));

        // Wydarzenia dla User 2
        createEvent("Urodziny", "2025-10-10", user2, List.of());
    }

    private UserModel createUser(String email, String password, UserRole role) {
        UserModel user = UserModel.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build();
        return userRepository.save(user);
    }

    private TagModel createTag(String name, UserModel user) {
        TagModel tag = TagModel.builder()
                .name(name)
                .user(user)
                .build();
        return tagRepository.save(tag);
    }

    private GuestModel createGuest(String firstName, String lastName, UserModel user, List<TagModel> tags) {
        GuestModel guest = GuestModel.builder()
                .firstName(firstName)
                .lastName(lastName)
                .user(user)
                .tags(new ArrayList<>(tags))
                .build();
        return guestRepository.save(guest);
    }

    private EventModel createEvent(String name, String date, UserModel user, List<GuestModel> guests) {
        EventModel event = EventModel.builder()
                .name(name)
                .date(date)
                .user(user)
                .guests(new ArrayList<>(guests))
                .build();
        return eventRepository.save(event);
    }
}
