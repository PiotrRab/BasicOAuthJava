package com.basic.events;

import com.basic.auth.AccessCheck;
import com.basic.guests.GuestModel;
import com.basic.guests.GuestRepository;
import com.basic.guests.GuestResponse;
import com.basic.guests.GuestService;
import com.basic.users.UserModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final GuestRepository guestRepository;
    private final GuestService guestService;
    private final AccessCheck accessCheck;

    public EventResponse createEvent(EventRequest request) {
        UserModel user = accessCheck.currentUser();
        
        List<GuestModel> guests = guestRepository.findAllById(request.getGuestIds());
        
        EventModel event = EventModel.builder()
                .name(request.getName())
                .date(request.getDate())
                .user(user)
                .guests(guests)
                .build();
        
        return mapToResponse(eventRepository.save(event));
    }

    public List<EventResponse> getAllEvents() {
        UserModel user = accessCheck.currentUser();
        return eventRepository.findAllByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(UUID id) {
        EventModel event = findEventAndCheckAccess(id);
        return mapToResponse(event);
    }

    public EventResponse updateEvent(UUID id, EventRequest request) {
        EventModel event = findEventAndCheckAccess(id);
        
        event.setName(request.getName());
        event.setDate(request.getDate());
        
        if (request.getGuestIds() != null) {
            List<GuestModel> guests = guestRepository.findAllById(request.getGuestIds());
            event.setGuests(guests);
        }
        
        return mapToResponse(eventRepository.save(event));
    }

    public void deleteEvent(UUID id) {
        EventModel event = findEventAndCheckAccess(id);
        eventRepository.delete(event);
    }

    private EventModel findEventAndCheckAccess(UUID id) {
        EventModel event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        UserModel user = accessCheck.currentUser();
        if (!event.getUser().getId().equals(user.getId()) && !accessCheck.isAdmin()) {
            throw new RuntimeException("Unauthorized to access this event");
        }
        
        return event;
    }

    private EventResponse mapToResponse(EventModel event) {
        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .date(event.getDate())
                .guests(event.getGuests().stream()
                        .map(guest -> GuestResponse.builder()
                                .id(guest.getId())
                                .firstName(guest.getFirstName())
                                .lastName(guest.getLastName())
                                // Tutaj można dodać mapowanie tagów jeśli potrzeba pełnego obiektu
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
