package com.sephora.services.inventoryavailability.model.dto;

import javax.validation.constraints.NotEmpty;

import com.sephora.services.common.inventory.model.BaseDTO;
import com.sun.istack.NotNull;

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
public class LocationEligibilityDTO extends BaseDTO {
	@NotNull
	private boolean enabled;
	@NotEmpty
	private String fulfillmentType;
	@NotEmpty
	private String locationId;
	@NotEmpty
	private String sellingChannel;
	private String updateUser;
	private String currentDateTime;
}
