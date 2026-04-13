package com.basic.guests;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/guests")
@RequiredArgsConstructor
public class GuestController {

    private final GuestService guestService;

    @PostMapping
    public ResponseEntity<GuestResponse> addGuest(@RequestBody GuestRequest request) {
        return ResponseEntity.ok(guestService.addGuest(request));
    }

    @GetMapping
    public ResponseEntity<List<GuestResponse>> getAllGuests() {
        return ResponseEntity.ok(guestService.getAllGuests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuestResponse> getGuestById(@PathVariable UUID id) {
        return ResponseEntity.ok(guestService.getGuestById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuestResponse> updateGuest(@PathVariable UUID id, @RequestBody GuestRequest request) {
        return ResponseEntity.ok(guestService.updateGuest(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuest(@PathVariable UUID id) {
        guestService.deleteGuest(id);
        return ResponseEntity.noContent().build();
    }
}
