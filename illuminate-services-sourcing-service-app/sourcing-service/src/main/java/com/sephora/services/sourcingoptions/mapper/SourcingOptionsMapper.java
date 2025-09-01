package com.sephora.services.sourcingoptions.mapper;

import com.sephora.services.sourcingoptions.model.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper
public interface SourcingOptionsMapper {

    SourcingOptionsMapper INSTANCE = Mappers.getMapper(SourcingOptionsMapper.class);

    default SourcingOptionsResponseDto buildAvailableResponse(SourcingOptionsRequestDto sourcingOptionsRequest, String shipNode) {
        return SourcingOptionsResponseDto.Builder.aSourcingOptionsResponseDto()
                .withAvailable(Boolean.TRUE)
                .withItems(
                        sourcingOptionsRequest.getItems()
                                .stream()
                                .map(item -> buildItemResponseDto(item, shipNode, true))
                                .collect(Collectors.toList()))
                .build();
    }

    default SourcingOptionsResponseDto buildUnavailableResponse(SourcingOptionsRequestDto sourcingOptionsRequest,
                                                                String unavailableReason,
                                                                Long maxShipNodeQuantity,
                                                                Long totalAvailableQuantity) {
        return SourcingOptionsResponseDto.Builder.aSourcingOptionsResponseDto()
                .withAvailable(Boolean.FALSE)
                .withItems(
                        sourcingOptionsRequest.getItems()
                                .stream()
                                .map(item -> buildItemRequestDto(item, unavailableReason, maxShipNodeQuantity, totalAvailableQuantity))
                                .collect(Collectors.toList()))
                .build();
    }

    default SourcingOptionsResponseDto buildUnavailableResponse(SourcingOptionsRequestDto sourcingOptionsRequest, String unavailableReason) {
        return buildUnavailableResponse(sourcingOptionsRequest, unavailableReason, 0L, 0L);
    }

    default SourcingOptionsResponseItemDto buildItemResponseDto(SourcingOptionsRequestItemDto item, String shipNode, boolean requestedQtyAvailable) {
        return SourcingOptionsResponseItemDto.Builder.anItemResponseDto()
                .withItemId(item.getItemId())
                .withRequestedQtyAvailable(requestedQtyAvailable)
                .withShipNode(shipNode)
                .build();
    }

    default SourcingOptionsResponseItemDto buildItemRequestDto(SourcingOptionsRequestItemDto item, String unavailableReason,
                                                               Long maxShipNodeQuantity, Long totalAvailableQuantity) {
        // always return totalAvailableQuantity=-1 in case of infinite inventory
        if (totalAvailableQuantity < 0) {
            totalAvailableQuantity = -1L;
        }
        return SourcingOptionsResponseItemDto.Builder.anItemResponseDto()
                .withItemId(item.getItemId())
                .withUnavailableReason(unavailableReason)
                .withMaxShipNodeQuantity(maxShipNodeQuantity)
                .withTotalAvailableQuantity(totalAvailableQuantity)
                .build();
    }

    default GetInventoryAvailabilityDto buildInventoryAvailabilityBean(SourcingOptionsRequestDto sourcingOptionsRequest,
                                                                       Map<String, Integer> shipNodePriorityMap,
                                                                       Map<String, Integer> itemsQuantity) {
        List<String> items = itemsQuantity.keySet().stream().collect(Collectors.toList());
        List<String> shipNodes = shipNodePriorityMap.keySet().stream().collect(Collectors.toList());

        return GetInventoryAvailabilityDto.builder()
                .enterpriseCode(sourcingOptionsRequest.getEnterpriseCode())
                .requestSourceSystem(sourcingOptionsRequest.getSourceSystem())
                .items(items)
                .shipNodes(shipNodes)
                .build();
    }

}
