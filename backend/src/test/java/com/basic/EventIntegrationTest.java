package com.basic;

import com.basic.config.JwtTokenProvider;
import com.basic.events.EventRequest;
import com.basic.events.EventResponse;
import com.basic.guests.GuestResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
public class EventIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private Cookie getAuthCookie(String email) {
        String token = jwtTokenProvider.generateAccessToken(email);
        return new Cookie("accessToken", token);
    }

    @Test
    void shouldGetAllEventsForUser1() throws Exception {
        mockMvc.perform(get("/api/events")
                        .cookie(getAuthCookie("user1@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3))); // Seeder adds 3 events for user1
    }

    @Test
    void shouldCreateEventWithGuests() throws Exception {
        // First get all guests to find IDs
        MvcResult guestResult = mockMvc.perform(get("/api/guests")
                        .cookie(getAuthCookie("user1@test.com")))
                .andReturn();
        GuestResponse[] guests = objectMapper.readValue(guestResult.getResponse().getContentAsString(), GuestResponse[].class);
        List<UUID> guestIds = Stream.of(guests).map(GuestResponse::getId).collect(Collectors.toList());

        EventRequest request = EventRequest.builder()
                .name("Nowy Event")
                .date("2026-01-01")
                .guestIds(guestIds)
                .build();

        mockMvc.perform(post("/api/events")
                        .cookie(getAuthCookie("user1@test.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nowy Event"))
                .andExpect(jsonPath("$.guests", hasSize(guestIds.size())));
    }

    @Test
    void shouldUpdateEvent() throws Exception {
        // Get existing event
        MvcResult eventResult = mockMvc.perform(get("/api/events")
                        .cookie(getAuthCookie("user1@test.com")))
                .andReturn();
        EventResponse[] events = objectMapper.readValue(eventResult.getResponse().getContentAsString(), EventResponse[].class);
        UUID eventId = events[0].getId();

        EventRequest updateRequest = EventRequest.builder()
                .name("Zaktualizowana Nazwa")
                .date("2027-01-01")
                .guestIds(null) // Should not clear guests if handled properly or clear if logic says so
                .build();

        mockMvc.perform(put("/api/events/" + eventId)
                        .cookie(getAuthCookie("user1@test.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Zaktualizowana Nazwa"));
    }

    @Test
    void shouldNotDeleteEventOwnedByAnotherUser() throws Exception {
        // User 2's event
        MvcResult eventResult = mockMvc.perform(get("/api/events")
                        .cookie(getAuthCookie("user2@test.com")))
                .andReturn();
        EventResponse[] events = objectMapper.readValue(eventResult.getResponse().getContentAsString(), EventResponse[].class);
        UUID user2EventId = events[0].getId();

        // User 1 tries to delete User 2's event
        mockMvc.perform(delete("/api/events/" + user2EventId)
                        .cookie(getAuthCookie("user1@test.com")))
                .andExpect(status().isInternalServerError());
    }
}
