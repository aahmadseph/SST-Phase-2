package com.sephora.services.sourcingoptions.model.cosmos;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;

import javax.persistence.Id;
import java.io.Serializable;
import java.util.UUID;

import static com.sephora.services.sourcingoptions.model.cosmos.Constants.CARRIER_SERVICE_CONTAINER_NAME;


@Container(containerName = CARRIER_SERVICE_CONTAINER_NAME)
@CosmosIndexingPolicy(
        includePaths = {
                "/carrierServiceCode/?",
                "/levelOfService/?",
                "/enterpriseCode/?" },
        excludePaths = { "/*" })
@Builder
@FieldNameConstants
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarrierService implements Serializable {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    @PartitionKey
    private String carrierServiceCode;


    private String levelOfService;

    @Enum(enumClass = EnterpriseCodeEnum.class)
    private String enterpriseCode;

    private Boolean isHazmat;

    private Calendar pickupCalendar;

    private Calendar deliveryCalendar;

    private Integer transitDays;

    private Integer additionalTransitDays;

    private Integer deliveryDateType;

    @ApiModelProperty(hidden = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String _etag;
}
