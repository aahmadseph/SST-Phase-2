package com.sephora.services.sourcingoptions.graph;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.sephora.services.sourcingoptions.model.dto.LocationPriority;
import com.sephora.services.sourcingoptions.model.dto.LocationsByPriorityInput;
import com.sephora.services.sourcingoptions.model.dto.LocationsByPriorityResponse;
import com.sephora.services.sourcingoptions.service.LocationPrioritiesService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@DgsComponent
@Log4j2
public class LocationPrioritiesDataFetcher {

    @Autowired
    LocationPrioritiesService locationPrioritiesService;

    @DgsQuery
    public LocationsByPriorityResponse locationsByPriority(@InputArgument("input") LocationsByPriorityInput input) {
        return locationPrioritiesService.getLocationPriorities(input);
    }
}
