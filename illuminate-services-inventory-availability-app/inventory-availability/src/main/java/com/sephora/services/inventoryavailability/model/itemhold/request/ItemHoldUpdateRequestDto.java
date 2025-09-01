
package com.sephora.services.inventoryavailability.model.itemhold.request;

import com.sephora.services.common.inventory.model.BaseDTO;
import lombok.*;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(
        includeFieldNames = false
)
public class ItemHoldUpdateRequestDto extends BaseDTO {

    @NotEmpty(message = "sellingChannel cannot be null or empty")
    private String sellingChannel;
    @NotNull(message="products property should not be null")
    @Size(min=1, message="products property should have at least one item")
    private List<@Valid ItemHoldUpdateProduct> products = null;

}
