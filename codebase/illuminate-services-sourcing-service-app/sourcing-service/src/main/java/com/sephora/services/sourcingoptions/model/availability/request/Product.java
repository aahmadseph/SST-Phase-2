
package com.sephora.services.sourcingoptions.model.availability.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    private String fulfillmentType;
    private List<Location> locations = null;
    private String productId;
    private String uom;

}
