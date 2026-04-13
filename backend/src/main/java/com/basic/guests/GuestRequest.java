package com.basic.guests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestRequest {
    private String firstName;
    private String lastName;
    private List<UUID> tagIds;
    private UUID tableId;
}
