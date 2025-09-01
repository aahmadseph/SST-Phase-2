package com.sephora.productexpservice.model;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import org.springframework.data.annotation.Id;

import com.sephora.platform.common.validation.Enum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@Container(containerName = "ReferenceItemsCollection")
@CosmosIndexingPolicy(
        includePaths = { "/referenceStatus/?" },
        excludePaths = "/*" )
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
   @PartitionKey
   private String id;

   private String name;

   @Enum(enumClass = ReferenceStatusEnum.class)
   private String referenceStatus;

   private int quantity;

}
