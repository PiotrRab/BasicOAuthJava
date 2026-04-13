package com.basic.guests;

import com.basic.auth.AccessCheck;
import com.basic.room_layout.TableModel;
import com.basic.room_layout.TableRepository;
import com.basic.tags.TagModel;
import com.basic.tags.TagRepository;
import com.basic.tags.TagService;
import com.basic.users.UserModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestService {

    private final GuestRepository guestRepository;
    private final TagRepository tagRepository;
    private final TagService tagService;
    private final AccessCheck accessCheck;
    private final TableRepository tableRepository;

    public GuestResponse addGuest(GuestRequest request) {
        UserModel user = accessCheck.currentUser();
        
        List<TagModel> tags = tagRepository.findAllById(request.getTagIds());
        
        GuestModel guest = GuestModel.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .user(user)
                .tags(tags)
                .build();
        
        if (request.getTableId() != null) {
            TableModel table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new RuntimeException("Table not found"));
            guest.setTable(table);
        }
        
        return mapToResponse(guestRepository.save(guest));
    }

    public List<GuestResponse> getAllGuests() {
        UserModel user = accessCheck.currentUser();
        return guestRepository.findAllByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public GuestResponse getGuestById(UUID id) {
        GuestModel guest = findGuestAndCheckAccess(id);
        return mapToResponse(guest);
    }

    public GuestResponse updateGuest(UUID id, GuestRequest request) {
        GuestModel guest = findGuestAndCheckAccess(id);
        
        guest.setFirstName(request.getFirstName());
        guest.setLastName(request.getLastName());
        
        if (request.getTagIds() != null) {
            List<TagModel> tags = tagRepository.findAllById(request.getTagIds());
            guest.setTags(tags);
        }

        if (request.getTableId() != null) {
            TableModel table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new RuntimeException("Table not found"));
            guest.setTable(table);
        } else {
            guest.setTable(null);
        }
        
        return mapToResponse(guestRepository.save(guest));
    }

    public void deleteGuest(UUID id) {
        GuestModel guest = findGuestAndCheckAccess(id);
        guestRepository.delete(guest);
    }

    private GuestModel findGuestAndCheckAccess(UUID id) {
        GuestModel guest = guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guest not found"));
        
        UserModel user = accessCheck.currentUser();
        if (!guest.getUser().getId().equals(user.getId()) && !accessCheck.isAdmin()) {
            throw new RuntimeException("Unauthorized to access this guest");
        }
        
        return guest;
    }

    public GuestResponse mapToResponse(GuestModel guest) {
        return GuestResponse.builder()
                .id(guest.getId())
                .firstName(guest.getFirstName())
                .lastName(guest.getLastName())
                .tableId(guest.getTable() != null ? guest.getTable().getId() : null)
                .tags(guest.getTags().stream()
                        .map(tagService::mapToResponse)
                        .collect(Collectors.toList()))
                .build();
    }
}
