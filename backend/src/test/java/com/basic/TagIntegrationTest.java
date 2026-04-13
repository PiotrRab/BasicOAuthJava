package com.basic;

import com.basic.config.JwtTokenProvider;
import com.basic.tags.TagRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
public class TagIntegrationTest extends BaseIntegrationTest {

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
    void shouldGetAllTagsForCurrentUser() throws Exception {
        mockMvc.perform(get("/api/tags")
                        .cookie(getAuthCookie("user1@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5))); // User 1 has 5 tags in seeder
    }

    @Test
    void shouldCreateNewTag() throws Exception {
        TagRequest request = TagRequest.builder().name("Nowy Tag").build();

        mockMvc.perform(post("/api/tags")
                        .cookie(getAuthCookie("user1@test.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nowy Tag"));
    }

    @Test
    void shouldNotCreateDuplicateTagForSameUser() throws Exception {
        TagRequest request = TagRequest.builder().name("Rodzina").build();

        mockMvc.perform(post("/api/tags")
                        .cookie(getAuthCookie("user1@test.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError()); // logic in service throws RuntimeException
    }

    @Test
    void shouldAllowSameTagNameForDifferentUsers() throws Exception {
        TagRequest request = TagRequest.builder().name("Nowy Tag Unikalny").build();

        // User 1 creates
        mockMvc.perform(post("/api/tags")
                        .cookie(getAuthCookie("user1@test.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // User 2 creates same name
        mockMvc.perform(post("/api/tags")
                        .cookie(getAuthCookie("user2@test.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}
