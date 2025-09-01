
package com.sephora.services.inventoryavailability.model.itemhold.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(
        includeFieldNames = false
)
public class ItemHoldUpdateProduct {
    @NotEmpty(message="productId cannot be empty or null")
    private String productId;
    @NotNull(message="onhold property should not be null")
    private Boolean onhold;

}
