package com.basic.room_layout;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@RequestBody RoomModel room) {
        return ResponseEntity.ok(roomService.createRoom(room));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable UUID id) {
        RoomModel room = roomService.getRoomEntity(id);
        return ResponseEntity.ok(RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .perimeter(room.getPerimeter())
                .build());
    }

    @GetMapping("/{id}/tables")
    public ResponseEntity<List<TableResponse>> getTablesByRoom(@PathVariable UUID id) {
        return ResponseEntity.ok(roomService.getTablesByRoom(id));
    }

    @PostMapping("/{id}/tables")
    public ResponseEntity<TableResponse> addTableToRoom(@PathVariable UUID id, @RequestBody TableModel table) {
        return ResponseEntity.ok(roomService.addTableToRoom(id, table));
    }

    @PutMapping("/tables/{id}")
    public ResponseEntity<TableResponse> updateTable(@PathVariable UUID id, @RequestBody TableModel table) {
        return ResponseEntity.ok(roomService.updateTable(id, table));
    }

    @DeleteMapping("/tables/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable UUID id) {
        roomService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}
