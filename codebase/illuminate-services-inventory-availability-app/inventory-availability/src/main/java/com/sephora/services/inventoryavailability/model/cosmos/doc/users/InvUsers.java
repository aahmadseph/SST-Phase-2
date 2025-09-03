package com.sephora.services.inventoryavailability.model.cosmos.doc.users;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import org.springframework.data.annotation.Id;

import com.sephora.services.inventoryavailability.cosmos.config.CosmosConfiguration;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Container(containerName = CosmosConfiguration.INV_USERS_COLLECTION)
@CosmosIndexingPolicy(
		includePaths = { "/userId/?" },
		excludePaths = "/*" )
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class InvUsers {
	@Id
	private String id;
	@PartitionKey
	private String userId;
	private String[] roles;
}
