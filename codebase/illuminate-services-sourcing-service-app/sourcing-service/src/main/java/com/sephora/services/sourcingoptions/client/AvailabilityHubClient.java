package com.sephora.services.sourcingoptions.client;

import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.cartsource.response.AHCartSourceResponse;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request.AHPromiseDateRequest;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.AHPromiseDateResponse;
import feign.Headers;
import feign.Param;
import feign.RequestLine;
import io.micrometer.core.annotation.Timed;
import static com.sephora.services.sourcingoptions.SourcingOptionConstants.*;

public interface AvailabilityHubClient {
    /**
     * sAggregated -> Should be true when we make call from PromiseDate
     * 	auditEnabled -> for testing it should be false. *Discussion required if its to be passed*
     * 	ignoreCapacity -> Not required as there is no usecase as of now
     * 	ignoreExistingDemand -> from checkout pass it as false. If its from OMS then true.
     * 	Correlation-Id -> dynamic value to be passed.
     * @param request
     * @return
     */
    @RequestLine("POST /custom/dates-by-service?" +
            "isAggregated=true" +
            "&auditEnabled={auditEnabled}" +
            "&ignoreExistingDemand={ignoreExistingDemand}" +
            "&Correlation-Id={correlationId}")
    @Headers({ "Content-Type: application/json" })
    //@Timed("get.sourcinghub.datesbyservice.commits_response")
    @Timed(value = COMMITS_TIME_NAME, description  = COMMITS_TIME_DESCRIPTION, extraTags = {COMMITS_URI, DATES_BY_SERVICE_URI})
    AHPromiseDateResponse datesByService(AHPromiseDateRequest request,@Param("auditEnabled") boolean auditEnabled,
                                         @Param("ignoreExistingDemand") String ignoreExistingDemand,
                                         @Param("correlationId") String correlationId);
    /**
     * sAggregated -> Should be true when we make call from PromiseDate
     * 	auditEnabled -> for testing it should be false. *Discussion required if its to be passed*
     *  ignoreAvailability -> if it is true Yantriks will not consider availability while calculating EDD
     * 	ignoreCapacity -> Not required as there is no usecase as of now
     * 	ignoreExistingDemand -> from checkout pass it as false. If its from OMS then true.
     * 	Correlation-Id -> dynamic value to be passed.
     * @param request
     * @return
     */
    @RequestLine("POST /custom/dates-by-service?" +
            "isAggregated=true" +
            "&auditEnabled={auditEnabled}" +
            "&ignoreAvailability={ignoreAvailability}" +
            "&ignoreExistingDemand={ignoreExistingDemand}" +
            "&Correlation-Id={correlationId}")
    @Headers({ "Content-Type: application/json" })
    //@Timed("get.sourcinghub.datesbyservice.commits_response")
    @Timed(value = COMMITS_TIME_NAME, description  = COMMITS_TIME_DESCRIPTION, extraTags = {COMMITS_URI, DATES_BY_SERVICE_URI})
    AHPromiseDateResponse datesByService(AHPromiseDateRequest request,@Param("auditEnabled") boolean auditEnabled,
    		                             @Param("ignoreAvailability") boolean ignoreAvailability,
                                         @Param("ignoreExistingDemand") String ignoreExistingDemand,
                                         @Param("correlationId") String correlationId);
    
    /**
     * 
     * @param request
     * @param ignoreExistingDemand
     * @param correlationId
     * @return
     */
    @RequestLine("POST /custom/cart/source?ignoreExistingDemand={ignoreExistingDemand}&Correlation-Id={correlationId}")
    @Headers({ "Content-Type: application/json" })
    //@Timed("get.sourcinghub.cartsource.commits_response")
    @Timed(value = COMMITS_TIME_NAME, description  = COMMITS_TIME_DESCRIPTION, extraTags = {COMMITS_URI, CART_SOURCE_URI})
    AHCartSourceResponse cartSourceService(AHPromiseDateRequest request,  @Param("ignoreExistingDemand") String ignoreExistingDemand,
            @Param("correlationId") String correlationId);
    //Sending parameter "auditEnabled=true" in Yantriks url start
    @RequestLine("POST /custom/cart/source?ignoreExistingDemand={ignoreExistingDemand}&auditEnabled={auditEnabled}&Correlation-Id={correlationId}")
    @Headers({ "Content-Type: application/json" })
    //@Timed("get.sourcinghub.cartsource.commits_response")
    @Timed(value = COMMITS_TIME_NAME, description  = COMMITS_TIME_DESCRIPTION, extraTags = {COMMITS_URI, CART_SOURCE_URI})
    AHCartSourceResponse cartSourceService(AHPromiseDateRequest request, @Param("ignoreExistingDemand") String ignoreExistingDemand,@Param("auditEnabled") boolean auditEnabled,
                                           @Param("correlationId") String correlationId);
}
