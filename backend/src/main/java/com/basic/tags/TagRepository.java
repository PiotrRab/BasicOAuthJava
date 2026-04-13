package com.basic.tags;

import com.basic.users.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<TagModel, UUID> {
    Optional<TagModel> findByNameAndUser(String name, UserModel user);
    List<TagModel> findAllByUser(UserModel user);
}
