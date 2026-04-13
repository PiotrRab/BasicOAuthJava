package com.basic.events;

import com.basic.common.BaseModel;
import com.basic.guests.GuestModel;
import com.basic.users.UserModel;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventModel extends BaseModel {

    private String name; // np. "Wesele", "Poprawiny"
    private String date;

    // Relacja do użytkownika, który stworzył event
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private UserModel user;

    // Tabela pośrednia łącząca wydarzenia z gośćmi
    @ManyToMany
    @JoinTable(
            name = "event_guests", // nazwa tabeli pośredniej
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "guest_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<GuestModel> guests;
}