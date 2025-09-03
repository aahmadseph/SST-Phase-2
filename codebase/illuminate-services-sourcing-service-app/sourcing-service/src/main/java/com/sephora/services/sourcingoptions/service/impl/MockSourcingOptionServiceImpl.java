package com.sephora.services.sourcingoptions.service.impl;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import com.sephora.services.common.dynamicconfig.config.DynamicConfigConfiguration;
import com.sephora.services.common.dynamicconfig.model.DynamicConfigDto;
import com.sephora.services.common.dynamicconfig.service.DynamicConfigService;
import com.sephora.services.sourcingoptions.model.dto.*;
import com.sephora.services.sourcingoptions.util.SourcingUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang.math.DoubleRange;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sephora.services.sourcingoptions.model.dto.promisedate.PromiseDateResponseDto;
import com.sephora.services.sourcingoptions.service.MockSourcingOptionService;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

import static com.sephora.services.sourcingoptions.SourcingOptionConstants.OMS;
import static com.sephora.services.sourcingoptions.model.DeliveryDateTypeEnum.DELIVERY_BY;
import static com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum.SEPHORACA;

@Getter
@Setter
@Service
@Log4j2
public class MockSourcingOptionServiceImpl implements MockSourcingOptionService {
	
	private double defaultAvailabilityHubDelay = 1.5;
	@Value("#{'${sourcing.options.availabilityhub.mock.distribution}'.split(',')}") 
	private List<String> distributions;

	@Value("${sourcing.options.availabilityhub.promiseDtByCarrierServiceEnabled:true}")
	private boolean promiseDtByCarrierServiceEnabled;

	@Autowired
	private DynamicConfigService dynamicConfigService;

	@Autowired
	private DynamicConfigConfiguration configuration;
	
	private Map<DoubleRange, double[]> distributionMap = new TreeMap<DoubleRange, double[]>(
			new Comparator<DoubleRange>() {

				@Override
				public int compare(DoubleRange o1, DoubleRange o2) {
					return Double.compare(o2.getMaximumDouble() - o2.getMaximumDouble(), 
							o1.getMaximumDouble() - o1.getMinimumDouble());
				}
			});

	@Override
	public SourcingOptionsResponseDto buildMockSourcingOptionResponse(
			SourcingOptionsRequestDto sourcingOptionsRequest) {
		emulateReservationDelay();
		List<String> splitEddZipCodes = getSplitEddZipCodes();
		if (CollectionUtils.isNotEmpty(splitEddZipCodes)
				&& splitEddZipCodes.contains(sourcingOptionsRequest.getShippingAddress().getZipCode())) {
			return getSplitEddPromiseDatesResponse(sourcingOptionsRequest); // Send split EDD mock sourcing response only if the ZIP code matches
		}
		return getReservationSaveResponse(sourcingOptionsRequest);
	}

	private List<String> getSplitEddZipCodes() {
		try {
			DynamicConfigDto<Object> rawDynamicConfig = dynamicConfigService.get(configuration.getAppName(), DynamicConfigWrapperServiceImpl.SPLIT_EDD_ZIPCODES);
			if (rawDynamicConfig != null && !org.springframework.util.CollectionUtils.isEmpty(rawDynamicConfig.getConfigValue())) {
				return rawDynamicConfig.getConfigValue().stream()
						.map(Object::toString)
						.collect(Collectors.toList());
			}
		} catch(Exception e) {
			log.warn("Exception occurred while fetching splitEddZipCodes from dynamic config: {}", e.getMessage());
		}
		return Collections.emptyList();
	}

	/**
	 * Create mock SourcingOptionsResponse from request dto
	 * @param reservationDTO
	 * @return
	 */
	private SourcingOptionsResponseDto getReservationSaveResponse(SourcingOptionsRequestDto reservationDTO) {
		SourcingOptionsResponseDto sourcingOptionsResponseDto = new SourcingOptionsResponseDto();
		sourcingOptionsResponseDto.setAvailable(true);
		sourcingOptionsResponseDto.setDatesCalculated(true);
		String[] locationId = {"0701"};
		
		PromiseDateResponseDto promiseDateResponseDto = new PromiseDateResponseDto();
		if(!CollectionUtils.isEmpty(reservationDTO.getCarrierServiceCodes())) {
			promiseDateResponseDto.setCarrierServiceCode(reservationDTO.getCarrierServiceCodes().get(0));
		}
		
		sourcingOptionsResponseDto.setItems(reservationDTO.getItems().stream().map(requestItem -> {
			SourcingOptionsResponseItemDto responseItem = new SourcingOptionsResponseItemDto();
			responseItem.setItemId(requestItem.getItemId());
			if(CollectionUtils.isNotEmpty(requestItem.getLocationIds())){
				locationId[0] = requestItem.getLocationIds().get(0);
				responseItem.setShipNode(locationId[0]);
			} else if("SEPHORACA".equals(reservationDTO.getEnterpriseCode())){
				locationId[0] = "0750";
				responseItem.setShipNode("0750");
			} else {
				responseItem.setShipNode(locationId[0]);
			}
			if(StringUtils.isBlank(promiseDateResponseDto.getCarrierServiceCode()) 
					&& StringUtils.isNotBlank(requestItem.getCarrierServiceCode())) {
				promiseDateResponseDto.setCarrierServiceCode(requestItem.getCarrierServiceCode());
			}
			responseItem.setRequestedQtyAvailable(true);
			responseItem.setRequestedQuantity(requestItem.getRequiredQuantity());
			responseItem.setLineId(requestItem.getLineId());
			
			return responseItem;
		}).collect(Collectors.toList()));
		if(StringUtils.isBlank(promiseDateResponseDto.getCarrierServiceCode())) {
			promiseDateResponseDto.setCarrierServiceCode("10");
		}
		
		promiseDateResponseDto.setShipNode(locationId[0]);
		promiseDateResponseDto.setDcTimeZone("-04:00");
		String cutOffDate = SourcingUtils.currentDateTime("-04:00", 14);
		promiseDateResponseDto.setShippingDate(cutOffDate);
		promiseDateResponseDto.setDeliveryDate(SourcingUtils.currentDateTime("-04:00", 19));
		promiseDateResponseDto.setDeliveryDateType(1);
		promiseDateResponseDto.setCutoffTimestamp(cutOffDate);
		promiseDateResponseDto.setDelayAdded(false);
		ArrayList<PromiseDateResponseDto> promiseDateList = new ArrayList<PromiseDateResponseDto>();
		promiseDateList.add(promiseDateResponseDto);
		sourcingOptionsResponseDto.setPromiseDates(promiseDateList);

		if (promiseDtByCarrierServiceEnabled) {
			PromiseDtByCarrierServiceNLocation promiseDtByCarrierServiceNLocation = new PromiseDtByCarrierServiceNLocation();
			promiseDtByCarrierServiceNLocation.setCarrierServiceCode(promiseDateResponseDto.getCarrierServiceCode());
			Location location = Location.builder()
					.shipNode(promiseDateResponseDto.getShipNode())
					.dcTimeZone(promiseDateResponseDto.getDcTimeZone())
					.shippingDate(promiseDateResponseDto.getShippingDate())
					.deliveryDate(promiseDateResponseDto.getDeliveryDate())
					.deliveryDateType(promiseDateResponseDto.getDeliveryDateType())
					.cutoffTimestamp(promiseDateResponseDto.getCutoffTimestamp())
					.delayAdded(promiseDateResponseDto.getDelayAdded())
					.build();
			promiseDtByCarrierServiceNLocation.setLocations(List.of(location));
			sourcingOptionsResponseDto.setPromiseDtByCarrierServiceNLocations(List.of(promiseDtByCarrierServiceNLocation));
		}
		return sourcingOptionsResponseDto;
	}

	private SourcingOptionsResponseDto getSplitEddPromiseDatesResponse(SourcingOptionsRequestDto sourcingOptionsRequestDto) {
		SourcingOptionsResponseDto sourcingOptionsResponseDto = new SourcingOptionsResponseDto();
		sourcingOptionsResponseDto.setAvailable(true);
		sourcingOptionsResponseDto.setDatesCalculated(true);
		List<SourcingOptionsResponseItemDto> items = new ArrayList<>();
		List<String> usLocations = List.of("1021", "1001", "0801", "0701", "0901");
		List<String> caLocations = List.of("0750", "1070");
		List<String> suitableShipNodes = SEPHORACA.toString().equals(sourcingOptionsRequestDto.getEnterpriseCode()) ? caLocations : usLocations;
		Map<String, String> shipNodeDeliveryDates = new HashMap<>();
		List<PromiseDateResponseDto> promiseDates = new ArrayList<>();
		Random random = new Random();
		int shipNodeIndex = 0;
		for (SourcingOptionsRequestItemDto sourcingOptionsRequestItemDto : sourcingOptionsRequestDto.getItems()) {
			SourcingOptionsResponseItemDto sourcingOptionsResponseItemDto = new SourcingOptionsResponseItemDto();
			sourcingOptionsResponseItemDto.setItemId(sourcingOptionsRequestItemDto.getItemId());
			sourcingOptionsResponseItemDto.setRequestedQuantity(sourcingOptionsRequestItemDto.getRequiredQuantity());
			sourcingOptionsResponseItemDto.setLineId(sourcingOptionsRequestItemDto.getLineId());
			String assignedShipNode = suitableShipNodes.get(shipNodeIndex);
			shipNodeIndex = (shipNodeIndex + 1) % suitableShipNodes.size(); // Cycle through shipNodes
			sourcingOptionsResponseItemDto.setShipNode(assignedShipNode);
			sourcingOptionsResponseItemDto.setRequestedQtyAvailable(true);
			items.add(sourcingOptionsResponseItemDto);
			String deliveryDate = SourcingUtils.currentDateTime("-04:00", random.nextInt(121) + 120); // Random date within 5-10 days
			if (OMS.equals(sourcingOptionsRequestDto.getSourceSystem())) {
				PromiseDateResponseDto promiseDateResponseDto = getPromiseDateResponseDto(sourcingOptionsRequestItemDto.getCarrierServiceCode(), deliveryDate, assignedShipNode);
				promiseDates.add(promiseDateResponseDto);
			} else {
				shipNodeDeliveryDates.put(assignedShipNode, deliveryDate);
			}
		}
		sourcingOptionsResponseDto.setItems(items);
		if (!OMS.equals(sourcingOptionsRequestDto.getSourceSystem())) {
			List<PromiseDtByCarrierServiceNLocation> promiseDtByCarrierServiceNLocations = new ArrayList<>();
			// Sort shipNodes by delivery date earliest to farthest
			List<Map.Entry<String, String>> sortedShipNodes = shipNodeDeliveryDates.entrySet().stream()
					.sorted(Map.Entry.comparingByValue())
					.collect(Collectors.toList());
			Map.Entry<String, String> farthestEntry = sortedShipNodes.get(sortedShipNodes.size() - 1);
			String farthestShipNode = farthestEntry.getKey();
			String farthestDeliveryDate = farthestEntry.getValue();
			List<String> carrierServiceCodes = sourcingOptionsRequestDto.getCarrierServiceCodes();
			if (null != carrierServiceCodes) {
				for (String carrierServiceCode : carrierServiceCodes) {
					String cutOffDate = SourcingUtils.currentDateTime("-04:00", 14);
					String shippingDate = SourcingUtils.currentDateTime("-04:00", 30);
					PromiseDateResponseDto promiseDateResponseDto = getPromiseDateResponseDto(carrierServiceCode, farthestDeliveryDate, farthestShipNode);
					promiseDates.add(promiseDateResponseDto);
					PromiseDtByCarrierServiceNLocation promiseDtByCarrierServiceNLocation = new PromiseDtByCarrierServiceNLocation();
					promiseDtByCarrierServiceNLocation.setCarrierServiceCode(carrierServiceCode);
					List<Location> locations = sortedShipNodes.stream()
							.map(entry -> Location.builder()
									.cutoffTimestamp(cutOffDate)
									.deliveryDate(entry.getValue())
									.deliveryDateType(DELIVERY_BY.ordinal())
									.shippingDate(shippingDate)
									.dcTimeZone("-04:00")
									.shipNode(entry.getKey())
									.build())
							.collect(Collectors.toList());
					promiseDtByCarrierServiceNLocation.setLocations(locations);
					promiseDtByCarrierServiceNLocations.add(promiseDtByCarrierServiceNLocation);
				}
			}
			sourcingOptionsResponseDto.setPromiseDtByCarrierServiceNLocations(promiseDtByCarrierServiceNLocations);
		}
		sourcingOptionsResponseDto.setPromiseDates(promiseDates);
		return sourcingOptionsResponseDto;
	}

	private PromiseDateResponseDto getPromiseDateResponseDto(String carrierServiceCode, String deliveryDate, String shipNode) {
		String cutOffDate = SourcingUtils.currentDateTime("-04:00", 14);
		String shippingDate = SourcingUtils.currentDateTime("-04:00", 30);
		PromiseDateResponseDto promiseDateResponseDto = new PromiseDateResponseDto();
		promiseDateResponseDto.setCarrierServiceCode(carrierServiceCode);
		promiseDateResponseDto.setShipNode(shipNode);
		promiseDateResponseDto.setDcTimeZone("-04:00");
		promiseDateResponseDto.setShippingDate(shippingDate);
		promiseDateResponseDto.setDeliveryDate(deliveryDate);
		promiseDateResponseDto.setDeliveryDateType(1);
		promiseDateResponseDto.setCutoffTimestamp(cutOffDate);
		promiseDateResponseDto.setDelayAdded(false);
		return promiseDateResponseDto;
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
					new double[] {Double.parseDouble(delayRage[0]), Double.parseDouble(delayRage[1])});
			
			minPercValue = maxPercValue;
		}
	}

}
