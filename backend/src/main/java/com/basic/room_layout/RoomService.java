package com.basic.room_layout;

import com.basic.auth.AccessCheck;
import com.basic.users.UserModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final TableRepository tableRepository;
    private final AccessCheck accessCheck;

    public RoomResponse createRoom(RoomModel roomData) {
        UserModel user = accessCheck.currentUser();
        RoomModel room = RoomModel.builder()
                .name(roomData.getName())
                .perimeter(roomData.getPerimeter())
                .user(user)
                .build();
        return mapToRoomResponse(roomRepository.save(room));
    }

    public List<RoomResponse> getAllRooms() {
        UserModel user = accessCheck.currentUser();
        return roomRepository.findAllByUser(user).stream()
                .map(this::mapToRoomResponse)
                .collect(Collectors.toList());
    }

    public RoomModel getRoomEntity(UUID id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    @Transactional
    public TableResponse addTableToRoom(UUID roomId, TableModel tableData) {
        RoomModel room = getRoomEntity(roomId);
        TableModel table = TableModel.builder()
                .name(tableData.getName())
                .shape(tableData.getShape())
                .width(tableData.getWidth())
                .height(tableData.getHeight())
                .posX(tableData.getPosX())
                .posY(tableData.getPosY())
                .rotation(tableData.getRotation())
                .capacity(tableData.getCapacity())
                .room(room)
                .build();
        return mapToTableResponse(tableRepository.save(table));
    }

    public List<TableResponse> getTablesByRoom(UUID roomId) {
        RoomModel room = getRoomEntity(roomId);
        return tableRepository.findAllByRoom(room).stream()
                .map(this::mapToTableResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TableResponse updateTable(UUID tableId, TableModel tableData) {
        TableModel table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        
        table.setPosX(tableData.getPosX());
        table.setPosY(tableData.getPosY());
        table.setRotation(tableData.getRotation());
        table.setName(tableData.getName());
        table.setCapacity(tableData.getCapacity());
        
        return mapToTableResponse(tableRepository.save(table));
    }

    public void deleteTable(UUID id) {
        tableRepository.deleteById(id);
    }

    private RoomResponse mapToRoomResponse(RoomModel room) {
        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .perimeter(room.getPerimeter())
                .build();
    }

    private TableResponse mapToTableResponse(TableModel table) {
        return TableResponse.builder()
                .id(table.getId())
                .name(table.getName())
                .shape(table.getShape().name())
                .width(table.getWidth())
                .height(table.getHeight())
                .posX(table.getPosX())
                .posY(table.getPosY())
                .rotation(table.getRotation())
                .capacity(table.getCapacity())
                .build();
    }
}
