package com.sephora.services.inventory.model.intransitbydate;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sephora.services.common.inventory.model.BaseDTO;
import lombok.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class InTransitByDateDTO extends BaseDTO implements Serializable {

    @NotEmpty(message = "SKU should not be null or empty")
    private String sku;

    @NotEmpty(message = "Location should not be null or empty")
    private String location;

    @NotNull(message = "ArrivalDate entity should not be null")
    @JsonProperty("arrival_dates")
    private List<ArrivalDate> arrivalDates;

    @NotEmpty(message = "eventTimestamp property should not be null or empty")
    @JsonProperty("event_timestamp")
    private String eventTimestamp;
}
