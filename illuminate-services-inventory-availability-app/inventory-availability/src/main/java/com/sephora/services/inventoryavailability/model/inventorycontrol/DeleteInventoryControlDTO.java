package com.sephora.services.inventoryavailability.model.inventorycontrol;

import javax.validation.constraints.NotEmpty;

import com.sephora.services.common.inventory.model.BaseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString(exclude={"uom"})
@NoArgsConstructor
public class DeleteInventoryControlDTO extends BaseDTO {
	@NotEmpty
	private String locationId;
	@NotEmpty
	private String productId;
	@NotEmpty
	private String uom;
	private String currentDateTime;
}
