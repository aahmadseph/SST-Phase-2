
package com.sephora.services.inventoryavailability.model.availabilitysp.request;

import javax.validation.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
	@NotEmpty
    public String locationId;
    public String locationType;

}
