package com.basic.room_layout;

import com.basic.common.BaseModel;
import com.basic.guests.GuestModel;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "tables")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableModel extends BaseModel {

    private String name;

    @Enumerated(EnumType.STRING)
    private TableShape shape;

    private double width;
    private double height;

    @Column(name = "pos_x")
    private double posX;

    @Column(name = "pos_y")
    private double posY;

    private double rotation;

    private int capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private RoomModel room;

    @OneToMany(mappedBy = "table", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<GuestModel> guests;
}
