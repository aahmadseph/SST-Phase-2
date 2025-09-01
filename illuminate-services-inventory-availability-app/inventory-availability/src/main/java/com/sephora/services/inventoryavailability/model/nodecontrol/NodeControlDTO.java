package com.sephora.services.inventoryavailability.model.nodecontrol;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

import com.sephora.services.common.inventory.model.BaseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
public class NodeControlDTO extends BaseDTO {
	@NotEmpty
	private String locationId;
	@NotEmpty
	private String productId;
	@NotEmpty
	private String uom;

	@NotEmpty
	@Pattern(regexp = "^[0-9]{4}\\-[01][0-9]\\-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9].[0-9]{3}[-+][0-2][0-9]:[0-5][0-9]$", message = "Invalid date format in expirationTime property")
	private String expirationTime;

	private String updateUser;
	private String currentDateTime;
}
