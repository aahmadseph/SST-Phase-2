package com.sephora.services.inventory.repository.cosmos;

import java.util.List;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import com.sephora.services.inventory.cosmos.CosmosDbConstants;
import com.sephora.services.inventory.model.cosmos.doc.InvRoles;

@Repository(CosmosDbConstants.INV_ROLES_CONTAINER_NAME)
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public interface InvRolesRepository extends CosmosRepository<InvRoles, String > {
	List<InvRoles> findAll();
}
