package com.basic;

import com.basic.config.JwtTokenProvider;
import com.basic.guests.GuestRequest;
import com.basic.guests.GuestResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
public class GuestIntegrationTest extends BaseIntegrationTest {

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
    void shouldGetAllGuestsForUser1() throws Exception {
        mockMvc.perform(get("/api/guests")
                        .cookie(getAuthCookie("user1@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5))); // Seeder adds 5 guests for user1
    }

    @Test
    void shouldGetGuestById() throws Exception {
        // First get all to find an ID
        MvcResult result = mockMvc.perform(get("/api/guests")
                        .cookie(getAuthCookie("user1@test.com")))
                .andReturn();
        
        GuestResponse[] guests = objectMapper.readValue(result.getResponse().getContentAsString(), GuestResponse[].class);
        UUID guestId = guests[0].getId();

        mockMvc.perform(get("/api/guests/" + guestId)
                        .cookie(getAuthCookie("user1@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(guestId.toString()));
    }

    @Test
    void shouldNotGetGuestOwnedByAnotherUser() throws Exception {
        // User 2's guest
        MvcResult result = mockMvc.perform(get("/api/guests")
                        .cookie(getAuthCookie("user2@test.com")))
                .andReturn();
        GuestResponse[] guests = objectMapper.readValue(result.getResponse().getContentAsString(), GuestResponse[].class);
        UUID user2GuestId = guests[0].getId();

        // User 1 tries to access User 2's guest
        mockMvc.perform(get("/api/guests/" + user2GuestId)
                        .cookie(getAuthCookie("user1@test.com")))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldCreateGuestWithTags() throws Exception {
        GuestRequest request = GuestRequest.builder()
                .firstName("Nowy")
                .lastName("Gosc")
                .tagIds(Collections.emptyList())
                .build();

        mockMvc.perform(post("/api/guests")
                        .cookie(getAuthCookie("user1@test.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Nowy"));
    }

    @Test
    void shouldDeleteGuest() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/guests")
                        .cookie(getAuthCookie("user1@test.com")))
                .andReturn();
        GuestResponse[] guests = objectMapper.readValue(result.getResponse().getContentAsString(), GuestResponse[].class);
        UUID guestId = guests[0].getId();

        mockMvc.perform(delete("/api/guests/" + guestId)
                        .cookie(getAuthCookie("user1@test.com")))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/guests/" + guestId)
                        .cookie(getAuthCookie("user1@test.com")))
                .andExpect(status().isInternalServerError());
    }
}
