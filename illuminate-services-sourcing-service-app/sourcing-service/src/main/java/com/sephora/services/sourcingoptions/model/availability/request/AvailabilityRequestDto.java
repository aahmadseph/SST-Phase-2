
package com.sephora.services.sourcingoptions.model.availability.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityRequestDto {

    private String currentDateTime;
    private List<Product> products = null;
    private String requestOrigin;
    private String sellingChannel;
    private String transactionType;

}
