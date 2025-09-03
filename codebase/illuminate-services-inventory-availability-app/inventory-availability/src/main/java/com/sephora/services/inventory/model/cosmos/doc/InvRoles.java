package com.sephora.services.inventory.model.cosmos.doc;

import static com.sephora.services.inventory.cosmos.CosmosDbConstants.INV_ROLES_COLLECTION;

import java.util.List;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Container(containerName = INV_ROLES_COLLECTION)
@CosmosIndexingPolicy(
		includePaths = {"/roleName/?" },
		excludePaths = "/*" )
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class InvRoles {
	@Id
	private String id;
	
	@PartitionKey
	private String roleName;
	
	private List<String> privileges;
}
