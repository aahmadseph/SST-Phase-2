package com.sephora.services.sourcingoptions.model.dto.promisedate.shipnodedelay.ah.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class AHShipNodeDelayRequestDto {
	private String ruleId;
	private String orgId;
	private String fulfillmentService;
	private String locationId;
	private String locationType;
	private String startDateTime;
	private String endDateTime;
	private Integer processingTimeBuffer;
	private String updateTime;
	private String updateUser;
}
