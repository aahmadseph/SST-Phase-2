package com.sephora.services.inventoryavailability.cosmos.repository;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.sephora.services.inventoryavailability.model.cosmos.doc.item.ItemDoc;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public interface ItemRepository extends CosmosRepository<ItemDoc, String> {
    List<ItemDoc> findByItemIdAndOrganizationCode(String itemId, String organizationCode);
}
