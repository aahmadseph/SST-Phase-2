package com.sephora.services.inventory.model.intransitbydate;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArrivalDate {
    private String date;
    private int quantity;
}