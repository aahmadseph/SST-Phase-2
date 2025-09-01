//package com.sephora.services.inventory.cosmos.template;
//
//import static java.nio.charset.StandardCharsets.UTF_8;
//
//import java.io.IOException;
//import java.net.URL;
//
//import org.apache.commons.io.IOUtils;
//import org.springframework.http.HttpStatus;
//
//import com.azure.data.cosmos.AccessCondition;
//import com.azure.data.cosmos.AccessConditionType;
//import com.azure.data.cosmos.CosmosClientException;
//import com.azure.data.cosmos.CosmosContainerProperties;
//import com.azure.data.cosmos.CosmosItemProperties;
//import com.azure.data.cosmos.CosmosItemRequestOptions;
//import com.azure.data.cosmos.CosmosItemResponse;
//import com.azure.data.cosmos.CosmosTriggerProperties;
//import com.azure.data.cosmos.CosmosTriggerResponse;
//import com.azure.data.cosmos.FeedResponse;
//import com.azure.data.cosmos.TriggerOperation;
//import com.azure.data.cosmos.TriggerType;
//import com.microsoft.azure.spring.data.cosmosdb.CosmosDbFactory;
//import com.microsoft.azure.spring.data.cosmosdb.common.CosmosdbUtils;
//import com.microsoft.azure.spring.data.cosmosdb.core.convert.MappingCosmosConverter;
//import com.microsoft.azure.spring.data.cosmosdb.exception.CosmosDBAccessException;
//import com.microsoft.azure.spring.data.cosmosdb.repository.support.CosmosEntityInformation;
//import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
//
//import lombok.extern.log4j.Log4j2;
//import reactor.core.publisher.Mono;
//
//@Log4j2
//public class InventoryCosmosTemplate extends CustomCosmosTemplate {
//	public static final String INVENTORY_COLLECTION = "inventory";
//	public static final String INVENTORY_UPDATE_PRE_TRIGGER = "inventoryUpdatePreTrigger";
//
//	public InventoryCosmosTemplate(CosmosDbFactory cosmosDbFactory, MappingCosmosConverter mappingCosmosConverter,
//			String dbName) {
//		super(cosmosDbFactory, mappingCosmosConverter, dbName);
//	}
//
//	@Override
//	public CosmosContainerProperties createCollectionIfNotExists(CosmosEntityInformation<?, ?> information) {
//		CosmosContainerProperties properties = super.createCollectionIfNotExists(information);
//		if (INVENTORY_COLLECTION.equals(information.getCollectionName())) {
//			createPreTrigger(INVENTORY_UPDATE_PRE_TRIGGER, information.getCollectionName(), this);
//		}
//		return properties;
//	}
//
//	private void createPreTrigger(String triggerId, String collection, CustomCosmosTemplate cosmosTemplate) {
//        log.debug("Create trigger for collection {} with id {}", collection, triggerId);
//        String triggerPath = String.format("/js/%s.js", triggerId);
//
//        URL url = getClass().getResource(triggerPath);
//        if (url == null) {
//            log.error("Error during reading trigger file: {}. Trigger initialization skipped.", triggerPath);
//            return;
//        }
//        String triggerBody = null;
//        try {
//            triggerBody = IOUtils.toString(url, UTF_8);
//        } catch (IOException e) {
//            log.error("Error during reading trigger file: {}", triggerPath, e);
//        }
//        if (triggerBody != null) {
//
//            CosmosTriggerProperties cosmosTriggerProperties = new CosmosTriggerProperties()
//                    .id(triggerId)
//                    .body(triggerBody)
//                    .triggerType(TriggerType.PRE)
//                    .triggerOperation(TriggerOperation.ALL);
//
//            try {
//                CosmosTriggerResponse response = cosmosTemplate.getDatabase().getContainer(collection).getScripts()
//                        .createTrigger(cosmosTriggerProperties)
//                        .doOnError(CosmosClientException.class, throwable -> {
//                            if (throwable.statusCode() == HttpStatus.CONFLICT.value()) {
//                                log.info("Trigger {} already exists", triggerId);
//                            } else {
//                                log.error("Trigger creation error", throwable);
//                            }
//                        })
//                        .block();
//
//            } catch (Exception e) {
//                if (!(e.getCause() instanceof CosmosClientException)) {
//                    log.error("Error during creation trigger: {}", triggerId, e);
//                }
//            }
//
//        }
//    }
//}