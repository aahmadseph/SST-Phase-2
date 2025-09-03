package com.sephora.services.inventoryavailability.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import com.sephora.services.inventoryavailability.config.ConfigHubProperties;
import org.apache.commons.lang.math.DoubleRange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;

import com.sephora.services.inventoryavailability.config.InventoryApplicationConfig;
import com.sephora.services.inventoryavailability.mapping.GetAvailabilityMapper;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.AvailabilityByFulfillmentType;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.AvailabilityByLocation;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.AvailabilityDetail;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.GetAvailabilityResponseData;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemRequestDto;
import com.sephora.services.inventoryavailability.model.dto.InventoryItemsRequestDto;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

@Getter
@Setter
@Service
@Log4j2
@ConfigurationProperties(prefix = "availability.mock")

public class MockAvailabilityService {
	private double defaultAvailabilityHubDelay = 1.5;
	@Value("#{'${availability.mock.distribution}'.split(',')}")
	private List<String> distributions;
	@Autowired
	private InventoryApplicationConfig applicationConfig;
	@Autowired
	private GetAvailabilityMapper getAvailabilityMapper;

	@Autowired
	private ConfigHubProperties configHubProperties;

	private Map<DoubleRange, double[]> distributionMap = new TreeMap<DoubleRange, double[]>(
			new Comparator<DoubleRange>() {
				@Override
				public int compare(DoubleRange o1, DoubleRange o2) {
					return Double.compare(o2.getMaximumDouble() - o2.getMaximumDouble(),
							o1.getMaximumDouble() - o1.getMinimumDouble());
				}
			});

	public GetAvailabilityResponseData buildMockAvailabilityResponse(InventoryItemsRequestDto inventoryItemsRequestDto) {
		emulateReservationDelay();
		return getAvailabilityResponse(inventoryItemsRequestDto, new GetAvailabilityResponseData());
	}

	/**
	 * Create mock response for the GetAvailability call from OMS
	 * 
	 * @param inventoryItemsRequestDto
	 * @return
	 */
	private GetAvailabilityResponseData getAvailabilityResponse(InventoryItemsRequestDto request,
			GetAvailabilityResponseData getAvailabilityResponseData) {
		getAvailabilityResponseData.setAvailabilityByProducts(new ArrayList<AvailabilityByProduct>());
		for (InventoryItemRequestDto product : request.getProducts()) {
//			InventoryItemRequestDto productRequest = request.getProducts().stream().filter(
//					inventoryItemRequestDto -> inventoryItemRequestDto.getProductId().equals(product.getProductId()))
//					.findFirst().get();
			log.info(" creating mock response for product having productId {}", product.getProductId());
			AvailabilityByProduct availabilityByProduct = getAvailabilityMapper
					.buildNoContentProductResponse(product, applicationConfig);
			log.debug("created mock response for product {} and response will be {}", product.getProductId(),
					availabilityByProduct);
			Double atp = configHubProperties.getInvAvailabilityAssumedAtp();
			for(AvailabilityByFulfillmentType availabilityByFulfillmentType:availabilityByProduct.getAvailabilityByFulfillmentTypes()) {
				for(AvailabilityDetail availabilityDetail:availabilityByFulfillmentType.getAvailabilityDetails()) {
					long numberOfLocations=0L;
					for(AvailabilityByLocation availabilityByLocation:availabilityDetail.getAvailabilityByLocations()) {
						availabilityByLocation.setAtp(atp);
						numberOfLocations++;
					}
					availabilityDetail.setAtp(atp * numberOfLocations);
				}
			}

//			availabilityByProduct.getAvailabilityByFulfillmentTypes().forEach(
//					availabilityByFulfillmentType->availabilityByFulfillmentType.getAvailabilityDetails().forEach(availabilityDetail->{
//						availabilityDetail.getAvailabilityByLocations().forEach(availabilityByLocation->{availabilityByLocation.setAtp(100.0);
//						});availabilityDetail.setAtp(100.0);}));
			
			getAvailabilityResponseData.getAvailabilityByProducts().add(availabilityByProduct);
			
		}
		return getAvailabilityResponseData;
	}

	/**
	 * Emulate availability hub delay
	 */
	public void emulateReservationDelay() {
		try {
			long delay = getNextAvailabilityHubDelay();
			log.info("Emulating availability hub delay... delay is {} ms", delay);
			TimeUnit.MILLISECONDS.sleep(delay);
		} catch (InterruptedException e) {
			log.warn("Emulating availability hub delay: awakened prematurely");
		}
	}

	/**
	 * generates delay in milliseconds for availability hub call
	 * 
	 * @return
	 */
	private long getNextAvailabilityHubDelay() {
		Random r = new Random();
		Double delay = null;
		double value = r.nextDouble() * 100;
		// select range
		for (Map.Entry<DoubleRange, double[]> entry : distributionMap.entrySet()) {
			if (entry.getKey().containsDouble(value)) {
				// get random delay in the selected range
				delay = getRandomInRange(entry.getValue()[0], entry.getValue()[1]);
			}
		}
		if (delay == null) {
			delay = getDefaultAvailabilityHubDelay();
		}
		long delayMs = Math.round(delay);
		log.debug("Return availability hub delay: {} milliseconds.", delayMs);
		return delayMs;
	}

	private static double getRandomInRange(double min, double max) {
		Random r = new Random();
		return min + (max - min) * r.nextDouble();
	}

	/**
	 * build distribution map
	 */
	@PostConstruct
	public void init() {
		log.debug(distributions);
		double minPercValue = 0;
		double maxPercValue = 0;
		for (String distribution : distributions) {
			String[] entry = distribution.split(":");
			String[] delayRage = entry[0].split("-");
			double requestPerc = Double.parseDouble(entry[1].substring(0, entry[1].indexOf("%")).trim());
			maxPercValue += requestPerc;

			this.distributionMap.put(new DoubleRange(minPercValue, maxPercValue),
					new double[] { Double.parseDouble(delayRage[0]), Double.parseDouble(delayRage[1]) });

			minPercValue = maxPercValue;
		}
	}

}
