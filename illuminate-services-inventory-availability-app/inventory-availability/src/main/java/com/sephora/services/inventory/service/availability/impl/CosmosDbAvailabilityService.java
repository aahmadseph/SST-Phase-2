package com.sephora.services.inventory.service.availability.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.sephora.services.inventory.repository.cosmos.InventoryRepository;
import com.sephora.services.inventory.service.InventoryShipNodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.model.availabilitysp.cachemiss.LocationByFulfillmentType;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.Product;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityDetail;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityDetail;
import com.sephora.services.inventory.model.cosmos.doc.Inventory;
import com.sephora.services.inventory.service.availability.AvailabilityService;

import lombok.extern.log4j.Log4j2;

@Service("CosmosDbAvailabilityService")
@Log4j2
public class CosmosDbAvailabilityService implements AvailabilityService {
	@Autowired
	InventoryShipNodeService shipNodeService;

	@Autowired(required = false)
	InventoryRepository inventoryRepository;

	//@Override
	public Map<String, AvailabilityByProduct> getAvailabiliy(Map<String, List<LocationByFulfillmentType>> products, String sellingChannel) {
		/*log.debug("Fetching avaiablility from second priority sorce (Cosmosdb) for products: {}", products);
		List<AvailabilityByProduct> availabilityByProductList = new ArrayList<AvailabilityByProduct>();
		try {
			List<String> activeNodes = shipNodeService.findByEnterpriseCode(sellingChannel);
			products.forEach(product -> {
				List<Inventory> inventories = inventoryRepository
						.findByItemIdAndEnterpriseCodeAndInfinite(product.getProductId(), sellingChannel, false);
				if(!inventories.isEmpty()) {
					double atp = 0D;
					for (Inventory inventory : inventories) {
						if (activeNodes.contains(inventory.getShipNode())) {
							atp += inventory.getQuantity();
						}
						availabilityByProductList.add(buildAvailabilityByProduct(product, inventory.getQuantity(), sellingChannel));
					}
					//availabilityByProductList.add(buildAvailabilityByProduct(product, atp, sellingChannel));
				}
			});

		} catch (Exception ex) {
			log.error("Exceptoin occur while fetching availability from cosmosDb", ex);
		}
		log.debug("Successfully fetched avaiablility from second priority sorce (Cosmosdb) with products: {}", availabilityByProductList);
		return availabilityByProductList;*/
		return null;
	}

	/**
	 * To build AvailabilityByProduct object for send back to caller
	 * 
	 * @param product
	 * @return
	 */
	private AvailabilityByProduct buildAvailabilityByProduct(Product product, double atp, String sellingChannel) {

		AvailabilityByProduct availabilityByProduct =  AvailabilityByProduct.builder()
				.productId(product.getProductId())
				.availabilityDetails(AvailabilityDetail.builder().atp(atp).build()).build();

		log.debug("Converted redis cache data to caller format: {}", availabilityByProduct);
		return availabilityByProduct;
	}


	@Override
	public AvailabilityService clone() {
		return new CosmosDbAvailabilityService();
	}


}
