package com.sephora.services.inventoryavailability.model.supply;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.sephora.services.common.inventory.model.BaseDTO;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ApiModel(value = "InventorySupplyDTO")
@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString(exclude = {"uom", "updateTimeStamp", "supplyType", "updateUser", "requestOrigin"})
@NoArgsConstructor
@Data
public class InventorySupplyDTO extends BaseDTO {

	@ApiModelProperty(value = "${InventorySupplyDTO.adjustmentType.value}", 
			required = true, position = 0, example = "DELTA")
	@NotEmpty
	private String adjustmentType;

	@ApiModelProperty(value = "InventorySupplyDTO.locationId.value", 
			required = true, position = 1, example = "0701")
	@NotEmpty
	private String locationId;

	@ApiModelProperty(value = "InventorySupplyDTO.productId.value", 
			required = true, position = 2, example = "ITEM-4")
	@NotEmpty
	private String productId;

	@ApiModelProperty(value = "InventorySupplyDTO.quantity.value", 
			required = true, position = 3, example = "2")
	@NotNull

	//@Min(-10)
	//@Max(5)
	private Double quantity;

	@ApiModelProperty(value = "InventorySupplyDTO.uom.value", 
			required = true, position = 4, example = "EACH")
	@NotEmpty
	private String uom;

	@ApiModelProperty(value = "InventorySupplyDTO.uom.value", 
			required = false, position = 5, example = "2020-12-03T10:15:30.123-08:00")
	private String updateTimeStamp;

	@ApiModelProperty(value = "InventorySupplyDTO.supplyType.value", 
			required = true, position = 6, example = "ONHAND")
	@NotEmpty
	private String supplyType;

	@ApiModelProperty(value = "InventorySupplyDTO.updateUser.value", 
			required = false, position = 7, example = "admin")
	private String updateUser;

	@ApiModelProperty(value = "InventorySupplyDTO.requestOrigin.value", 
			required = false, position = 8, example = "OMS")
	private String requestOrigin;
}
