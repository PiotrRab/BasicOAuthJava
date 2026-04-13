package com.basic.guests;

import com.basic.tags.TagResponse;
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
public class GuestResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private List<TagResponse> tags;
    private UUID tableId;
}
