package com.sephora.services.inventoryavailability.model.nodecontrol.availabilityhub;

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
public class NodeControlRequest {
	private String locationId;
	private String locationType;
	private String orgId;
	private String productId;
	private String segment;
	private String supplyType;
	private String tdet;
	private String uom;
	private String updateUser;
}
