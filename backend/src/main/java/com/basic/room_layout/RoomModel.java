package com.basic.room_layout;

import com.basic.common.BaseModel;
import com.basic.users.UserModel;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomModel extends BaseModel {

    private String name;

    @Column(columnDefinition = "TEXT")
    private String perimeter; // JSON list of Points [{"x":0, "y":0}, ...]

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private UserModel user;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TableModel> tables;
}
