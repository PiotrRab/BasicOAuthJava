package com.basic.room_layout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TableRepository extends JpaRepository<TableModel, UUID> {
    List<TableModel> findAllByRoom(RoomModel room);
}
