
package com.sephora.services.inventoryavailability.model.itemhold.cache;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemHoldUpdateCacheDto implements Serializable {

    private String productId;
    private String sellingChannel;
    private Boolean onHold;

}
