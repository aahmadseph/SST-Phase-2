package com.sephora.services.inventoryavailability.model.dto.graphql;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sephora.services.inventory.model.intransitbydate.ArrivalDate;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class IntransitAvailabilityByLocation extends AvailabilityByLocation {

    @JsonProperty("arrival_dates")
    private List<ArrivalDate> arrivalDates;
}
