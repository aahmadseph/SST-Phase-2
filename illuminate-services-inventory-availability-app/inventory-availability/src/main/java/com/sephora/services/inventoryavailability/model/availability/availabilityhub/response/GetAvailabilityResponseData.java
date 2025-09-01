
package com.sephora.services.inventoryavailability.model.availability.availabilityhub.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import lombok.*;

import java.util.List;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@ToString(exclude={"orgId", "transactionType"})
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GetAvailabilityResponseData {

    private String orgId;
    private String sellingChannel;
    private String transactionType;
    private List<AvailabilityByProduct> availabilityByProducts = null;
    private ErrorResponseDTO error;

}
