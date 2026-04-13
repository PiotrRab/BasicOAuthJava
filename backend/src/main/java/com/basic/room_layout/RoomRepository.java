package com.basic.room_layout;

import com.basic.users.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<RoomModel, UUID> {
    List<RoomModel> findAllByUser(UserModel user);
}
