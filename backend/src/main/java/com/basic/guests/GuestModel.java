package com.basic.guests;

import com.basic.common.BaseModel;
import com.basic.events.EventModel;
import com.basic.room_layout.TableModel;
import com.basic.tags.TagModel;
import com.basic.users.UserModel;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "guests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestModel extends BaseModel {

    private String firstName;
    private String lastName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private UserModel user;

    @ManyToMany(mappedBy = "guests")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<EventModel> events;

    @ManyToMany
    @JoinTable(
            name = "guest_tags",
            joinColumns = @JoinColumn(name = "guest_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<TagModel> tags;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private TableModel table;
}
