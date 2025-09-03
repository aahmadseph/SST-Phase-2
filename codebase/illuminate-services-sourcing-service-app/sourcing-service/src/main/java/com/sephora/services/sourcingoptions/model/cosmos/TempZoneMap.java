package com.sephora.services.sourcingoptions.model.cosmos;

import static com.sephora.services.sourcingoptions.model.cosmos.Constants.TEMP_ZONE_MAP_CONTAINER_NAME;

import java.util.List;

import javax.persistence.Id;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Container(containerName = TEMP_ZONE_MAP_CONTAINER_NAME)
@CosmosIndexingPolicy(
	    includePaths = {
	        "/enterpriseCode/?" },
	    excludePaths = { "/*" } )
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TempZoneMap {
	@Id
	private String id;
	private String reference;
	@PartitionKey
	@Enum(enumClass = EnterpriseCodeEnum.class)
	private String enterpriseCode;
	private String status;
	private List<ZipCodeDetails> zipCodeDetails;
}
