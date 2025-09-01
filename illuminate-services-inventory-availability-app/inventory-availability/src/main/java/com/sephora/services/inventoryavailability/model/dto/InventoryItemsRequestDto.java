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

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Vitaliy Oleksiyenko
 */
@Getter
@Setter
@Builder(toBuilder = true)
@ToString(exclude={"defaultOrgId", "orgId", "segment", "transactionType"})
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemsRequestDto implements Serializable {

	
	@Value("${inventory.defaultOrgId}")
	@JsonIgnore
	private String defaultOrgId;

    private String orgId;
    private List < InventoryItemRequestDto > products;
    private String segment;
    private String sellingChannel;
    private String transactionType;
    
	@JsonProperty(value = "orgId")
	public void setOrgId(String orgId) {
		this.orgId = orgId == null ? defaultOrgId : orgId;
	}
    
}
