//package com.sephora.services.inventory.cosmos.repository.impl;
//
//import java.util.Collections;
//import java.util.List;
//
//import com.sephora.services.inventory.repository.cosmos.CustomCosmosInventoryRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
//import com.sephora.platform.database.cosmosdb.repository.support.QuerySupportedCosmosRepository;
//import com.sephora.services.inventory.cosmos.repository.CustomCosmosInventoryRepository;
//import com.sephora.services.inventory.model.cosmos.doc.Inventory;
//
//import static com.sephora.services.inventory.cosmos.template.InventoryCosmosTemplate.INVENTORY_UPDATE_PRE_TRIGGER;
//
//public class CustomCosmosInventoryRepositoryImpl extends QuerySupportedCosmosRepository<Inventory, String>
//		implements CustomCosmosInventoryRepository {
//
//	private static final List<String> PRE_TRIGGERS = Collections.singletonList(INVENTORY_UPDATE_PRE_TRIGGER);
//	public CustomCosmosInventoryRepositoryImpl(@Autowired CustomCosmosTemplate cosmosTemplate) {
//		super(cosmosTemplate, Inventory.class);
//	}
//
//	@Override
//	public Inventory upsertWithTrigger(Inventory entity) {
//		return super.upsert(entity, PRE_TRIGGERS);
//	}
//
//}
