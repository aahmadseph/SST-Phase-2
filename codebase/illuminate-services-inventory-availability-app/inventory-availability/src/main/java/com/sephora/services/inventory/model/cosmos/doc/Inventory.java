/*
 *  This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 *  consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 *  Copyright  2019 sephora.com, Inc. All rights reserved.
 *
 */

package com.sephora.services.inventory.model.cosmos.doc;

import static com.sephora.services.inventory.cosmos.CosmosDbConstants.INVENTORY_COLLECTION;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.sephora.services.inventory.model.cosmos.EnterpriseCodeEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.springframework.data.annotation.Id;

import java.io.Serializable;



@Container(containerName = INVENTORY_COLLECTION)
@CosmosIndexingPolicy(
        includePaths = { "/itemId/?", "/enterpriseCode/?",  "/shipNode/?"},
        excludePaths = "/*" )
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Inventory implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
    private String id;
	@PartitionKey
    private String itemId;
    private EnterpriseCodeEnum enterpriseCode;
    private String shipNode;
    private Double quantity;
    private String threshold;
    private Boolean infinite = Boolean.FALSE;
    // The number of milliseconds from the unix epoch, 1 January 1970 00:00:00.000 UTC
    private Long modifyts;
}
