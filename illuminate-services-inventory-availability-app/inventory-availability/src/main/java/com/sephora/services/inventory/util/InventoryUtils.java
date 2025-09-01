package com.sephora.services.inventory.util;

import com.google.common.collect.ImmutableMap;
import com.sephora.services.inventory.config.PriorityConfig;
import com.sephora.services.inventory.model.EnterpriseCodeEnum;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByFT;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityDetail;
import org.springframework.stereotype.Component;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.TimeZone;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Component
public class InventoryUtils {

    public static final String US_INFINITE_SHIP_NODE_NAME = "US_INFINITE";
    public static final String CA_INFINITE_SHIP_NODE_NAME = "CA_INFINITE";

    private static final Map<String, String> ENTERPRISE_INFINITE_SHIPNODES =
            ImmutableMap.<String, String>builder()
                .put(EnterpriseCodeEnum.SEPHORAUS.name(), US_INFINITE_SHIP_NODE_NAME)
                .put(EnterpriseCodeEnum.SEPHORACA.name(), CA_INFINITE_SHIP_NODE_NAME)
                .build();


    public static String getInfiniteShipNodeName(String enterpriseCode) {
        return ENTERPRISE_INFINITE_SHIPNODES.get(enterpriseCode);
    }
    /**
     * 
     * @param dateTime
     * @return
     * @throws ParseException
     */
    public static Long convertDateTimeToPST(ZonedDateTime zonedDateTime) {
    	try {
	    	final String DATE_FORMAT_STR = "yyyy-MM-dd'T'HH:mm:ss.SSS";
	    	DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(DATE_FORMAT_STR);
	    	
	    	String dateTime = zonedDateTime.withZoneSameInstant(ZoneOffset.UTC).format(DATE_TIME_FORMATTER);
	    	
			DateFormat dateFormate = new SimpleDateFormat(DATE_FORMAT_STR);
			dateFormate.setTimeZone(TimeZone.getTimeZone("PST"));
			return dateFormate.parse(dateTime).getTime();
    	} catch(Exception e) {
    		return 0L;
    	}
	}
    
    public static Collection<List<String>> convertToBatch(List<String> products, int batchSize) {		
		final AtomicInteger counter = new AtomicInteger();
		Collection<List<String>> requestBatches = products.stream()
				.collect(Collectors.groupingBy(it -> counter.getAndIncrement() / batchSize)).values();
		
		return requestBatches;
	}
	//OMM-1462 Change default priority logic in GetAvailabilityForSitePages
	public static Map<String, AvailabilityByProduct> buildDefaultResponseForMissingPriority(List<String> products, List<String> locations, String fulfillmentType, final boolean isDetails,String defaultAtpStatus,double assumedAtp) {
		Map<String, AvailabilityByProduct> availabilityByProducts = new HashMap<String, AvailabilityByProduct>();
		products.stream().forEach(productId -> {
			List<AvailabilityByFT> availabilityByFTList = new ArrayList<AvailabilityByFT>();
			AvailabilityByFT availabilityByFT = AvailabilityByFT.builder().fulfillmentType(fulfillmentType)
					.locations(new ArrayList<com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation>()).build();
			if(!isDetails) {
				availabilityByFT.getLocations().add(com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation.builder().location(locations.stream().findFirst().orElse(null))
						.atpStatus(defaultAtpStatus).build());
			} else {
				availabilityByFT.getLocations().addAll(locations.stream().map(
						locationId -> com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation
								.builder().location(locationId)
								//AV-3195 - Create Request Origin and FulfillmentType based assumed ATP Logic
								.atp(assumedAtp)
								.atpStatus(defaultAtpStatus).build())
						        //AV-3195 - END
						        .collect(Collectors.toList()));
			}
			availabilityByFTList.add(availabilityByFT);
			availabilityByProducts.put(productId, AvailabilityByProduct.builder().productId(productId)
					.availabilityDetails(AvailabilityDetail.builder().availabilityByFT(availabilityByFTList).build()).build());
		});

		return availabilityByProducts;
	}
	//OMM-1462 END
}
