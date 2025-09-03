
package com.sephora.services.inventoryavailability.model.availabilitysp.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
	@NotEmpty
    public String productId;
    public String uom;
    public String fulfillmentType;
    @Valid
    public List<Location> locations;

}
