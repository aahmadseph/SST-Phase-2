package com.sephora.services.productaggregationservice.productaggregationservice.model;

import com.sephora.platform.common.validation.Enum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlType;
import org.springframework.data.annotation.Id;

@Container(containerName = "ReferenceItemContainer")
@CosmosIndexingPolicy(
        includePaths = { "/referenceStatus/?"},
        excludePaths = { "/*" })
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "item", propOrder = {
        "id",
        "name",
        "referenceStatus",
        "quantity"
})
public class ReferenceItem {

   @Id
   @XmlElement(required = true)
   private String id;

   @XmlElement(required = true)
   private String name;

   @Enum(enumClass = ReferenceStatusEnum.class)
   @XmlElement(required = true)
   private String referenceStatus;

   @XmlElement(required = true)
   private int quantity;

   @PartitionKey
   @Enum(enumClass = ReferenceStoreEnum.class)
   @XmlElement(required = true)
   private String storeId;

}

