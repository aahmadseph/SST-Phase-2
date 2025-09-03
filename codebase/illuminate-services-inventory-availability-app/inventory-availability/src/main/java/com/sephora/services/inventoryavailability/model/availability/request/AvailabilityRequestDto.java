
package com.sephora.services.inventoryavailability.model.availability.request;

import com.sephora.services.common.inventory.model.BaseDTO;
import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@ApiModel(value = "GetAvailabilityRequestDto")
public class AvailabilityRequestDto extends BaseDTO {

    @NotEmpty(message = "sellingChannel should not be null or empty")
    private String sellingChannel;
    private String currentDateTime;
    private String requestOrigin;
    private String transactionType;
    @NotNull(message = "products property should not be null")
    @Size(min=1, message = "products should have at least one element")
    private List< @Valid AvailabilityRequestProduct> products = null;

}
