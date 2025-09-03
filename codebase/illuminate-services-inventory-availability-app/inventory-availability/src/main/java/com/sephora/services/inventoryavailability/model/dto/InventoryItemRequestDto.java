/*
 *  This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 *  consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 *  Copyright  2020 sephora.com, Inc. All rights reserved.
 *
 */

package com.sephora.services.inventoryavailability.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.io.Serializable;
import java.util.List;

/**
 * @author Vitaliy Oleksiyenko
 */
@Getter
@Setter
@Builder
@ToString(exclude = {"uom", "fulfillmentType"})
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemRequestDto implements Serializable {

	private String productId;
	
	private String uom;

	/**
	 * FulfillmentType is not required for getting availability, but is required to generate
	 * response incase there is no response from yantriks.
	 */
	@JsonIgnore
	private String fulfillmentType;

    List<Location> locations;


}
