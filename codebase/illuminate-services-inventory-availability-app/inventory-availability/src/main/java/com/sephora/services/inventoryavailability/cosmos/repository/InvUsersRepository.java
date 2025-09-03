package com.sephora.services.inventoryavailability.cosmos.repository;

import java.util.List;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import com.sephora.services.inventoryavailability.model.cosmos.doc.users.InvUsers;

@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
@Repository
public interface InvUsersRepository extends CosmosRepository<InvUsers, String> {
	List<InvUsers> findAll();
}
