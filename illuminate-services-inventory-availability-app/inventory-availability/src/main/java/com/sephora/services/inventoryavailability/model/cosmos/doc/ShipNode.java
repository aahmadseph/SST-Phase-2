//package com.sephora.services.inventoryavailability.model.cosmos.doc;
//
//import com.microsoft.azure.spring.data.cosmosdb.core.mapping.Document;
//import com.microsoft.azure.spring.data.cosmosdb.core.mapping.DocumentIndexingPolicy;
//import com.microsoft.azure.spring.data.cosmosdb.core.mapping.PartitionKey;
//import com.sephora.services.inventoryavailability.model.cosmos.ShipNodeStatusEnum;
//import com.sephora.services.inventoryavailability.model.cosmos.EnterpriseCodeEnum;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import org.springframework.data.annotation.Id;
//
//import java.io.Serializable;
//
//import static com.sephora.services.inventoryavailability.cosmos.config.CosmosConfiguration.SHIP_NODE_COLLECTION;
//
//@Document(collection = SHIP_NODE_COLLECTION)
//@DocumentIndexingPolicy(includePaths = { "{\"path\":\"/enterpriseCode/?\"}" },
//                        excludePaths = { "{\"path\":\"/*\"}" })
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class ShipNode implements Serializable {
//
//    @Id
//    @PartitionKey
//    private String id;
//
//    private String name;
//
//    private EnterpriseCodeEnum enterpriseCode;
//
//    private String nodeType;
//
//    private String timeZone;
//
//    private ShipNodeStatusEnum status;
//
//    private String _etag;
//
//}
