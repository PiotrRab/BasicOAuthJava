package com.basic.room_layout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableResponse {
    private UUID id;
    private String name;
    private String shape;
    private double width;
    private double height;
    private double posX;
    private double posY;
    private double rotation;
    private int capacity;
}
