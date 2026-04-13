package com.basic.guests;

import com.basic.users.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GuestRepository extends JpaRepository<GuestModel, UUID> {
    List<GuestModel> findAllByUser(UserModel user);
}
