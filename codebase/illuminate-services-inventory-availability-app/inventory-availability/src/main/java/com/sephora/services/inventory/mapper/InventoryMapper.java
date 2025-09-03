package com.sephora.services.inventory.mapper;


import com.sephora.platform.common.mapper.BaseMapper;
import com.sephora.services.inventory.model.doc.Inventory;

import com.sephora.services.inventory.model.doc.ShipNode;
import com.sephora.services.inventory.model.dto.*;
import com.sephora.services.inventoryavailability.mapping.impl.CustomMappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.function.Function;

import static com.sephora.services.inventory.model.dto.EnterpriseItemDto.Builder.anEnterpriseItemDto;
import static com.sephora.services.inventory.model.dto.GetInventoryItemDetailsDto.Builder.anEnterpriseItemList;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.collections4.CollectionUtils.isNotEmpty;

@Mapper(uses = CustomMappers.class)
public interface InventoryMapper extends BaseMapper<Inventory, InventoryDto> {

    @Override
    @Mapping(target = "modifyTimestamp", source = "modifyts")
    InventoryDto convert(Inventory input);

    default InventoryInfoDto convertToInfoDto(Inventory input, Optional<ShipNode> shipNode) {
        if (input == null) {
            return null;
        }
        return InventoryInfoDto.Builder.anInventoryInfoDto()
                .withShipNode(input.getShipNode())
                .withShipNodeStatus(shipNode.map(s -> s.getStatus().name()).orElse(null))
                .withQuantity(input.getQuantity())
                .build();
    }

    @Mapping(target = "inventoryInfo", ignore = true)
    @Mapping(target = "infiniteInventory", source = "infinite")
    InventoryItemDto createInventoryItemDto(Inventory input, boolean infinite);

    @Mapping(target = "infiniteInventory", constant = "false")
    InventoryItemDto createInventoryItemDto(Inventory input, InventoryInfoDto inventoryInfo);

    default List<InventoryInfoDto> createInfoDtoList(InventoryInfoDto input) {
        return new ArrayList<>(Arrays.asList(input));
    }

    default InventoryResponseDto convertToInventoryResponseDto(List<Inventory> inventory, Function<String, Optional<ShipNode>> function) {
        if (org.apache.commons.collections4.CollectionUtils.isEmpty(inventory)) {
            return null;
        }
        List<InventoryItemDto> itemsWithInfiniteInventory = inventory.stream()
                .filter(i -> i.getInfinite())
                .map(i -> createInventoryItemDto(i, true))
                .collect(toList());

        List<String> itemsWithInfiniteInventoryIds = itemsWithInfiniteInventory.stream()
                .map(i -> i.getItemId())
                .collect(toList());

        List<InventoryItemDto> itemsWithStock = inventory.stream()
                .filter(i -> !itemsWithInfiniteInventoryIds.contains(i.getItemId()))
                .map(i -> createInventoryItemDto(i, convertToInfoDto(i, getShipNodeByKey(function, i.getShipNode()))))
                .collect(toList());

        List<InventoryItemDto> resultList = new ArrayList<>();
        resultList.addAll(itemsWithInfiniteInventory);

        Set<String> itemsWithStockIds = new HashSet<>();
        itemsWithStock.forEach(i -> {
            // If inventoryItem with such itemId already exists and inventoryInfo array is not empty
            if (itemsWithStockIds.contains(i.getItemId()) && isNotEmpty(i.getInventoryInfo())) {
                InventoryInfoDto inventoryInfoDto = i.getInventoryInfo().get(0);

                // Add inventoryInfo from current to existent inventoryItem
                resultList.stream()
                        .filter(it -> it.getItemId().equals(i.getItemId()))
                        .findFirst()
                        .ifPresent(it -> it.getInventoryInfo().add(inventoryInfoDto));
            } else {
                itemsWithStockIds.add(i.getItemId());
                resultList.add(i);
            }
        });

        InventoryResponseDto result = new InventoryResponseDto();
        result.setItems(resultList);

        return result;
    }

    default GetInventoryItemDetailsDto convertToGetInventoryItemDetailsDto(List<Inventory> inventoryItems,
                                                                           Function<String, Optional<ShipNode>> function) {
        if (CollectionUtils.isEmpty(inventoryItems)) {
            return null;
        }

        GetInventoryItemDetailsDto getInventoryItemDetailsDto = anEnterpriseItemList()
                .withItemId(inventoryItems.get(0).getItemId())
                .withEnterpriseItemList(new ArrayList<>())
                .build();

        // Add all infinite enterprise items
        getInventoryItemDetailsDto.getEnterprises().addAll(inventoryItems.stream()
                .filter(i -> i.getInfinite())
                .map(i -> anEnterpriseItemDto()
                        .withEnterpriseCode(i.getEnterpriseCode().name())
                        .withInfiniteInventory(Boolean.TRUE)
                        .build())
                .collect(toList()));

        for (Inventory inventory: inventoryItems) {
            String enterpriseCode = inventory.getEnterpriseCode().name();

            Optional<EnterpriseItemDto> enterpriseItemDto = getInventoryItemDetailsDto
                    .getEnterpriseItem(enterpriseCode);

            if (enterpriseItemDto.isPresent() && enterpriseItemDto.get().getInfiniteInventory()) {
                continue;
            }

            InventoryInfoDto itemInventoryInfo = convertToInfoDto(inventory, getShipNodeByKey(function, inventory.getShipNode()));
            if (enterpriseItemDto.isPresent()) {
                enterpriseItemDto.get().addInventoryInfo(itemInventoryInfo);
            } else {
                getInventoryItemDetailsDto.getEnterprises().add(
                        anEnterpriseItemDto()
                                .withEnterpriseCode(enterpriseCode)
                                .withInfiniteInventory(inventory.getInfinite())
                                .withInventoryInfo(itemInventoryInfo)
                                .build());
            }
        }
        return getInventoryItemDetailsDto;
    }

    default Optional<ShipNode> getShipNodeByKey( Function<String, Optional<ShipNode>> function, String shipNodeKey) {
        return Optional.ofNullable(function).flatMap(func -> func.apply(shipNodeKey));

    }
}