
package com.sephora.services.inventoryavailability.model.availability.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AvailabilityResponseDto {

    private String sellingChannel;
    private List<AvailabilityByProduct> availabilityByProducts = null;
    private ErrorResponseDTO error;


}
