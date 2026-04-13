package com.basic.events;

import com.basic.users.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<EventModel, UUID> {
    List<EventModel> findAllByUser(UserModel user);
}
