package com.sephora.services.inventory.service;

import com.azure.cosmos.implementation.BadRequestException;
import com.azure.spring.data.cosmos.exception.CosmosAccessException;
import com.sephora.platform.common.utils.DateTimeProvider;
import com.sephora.platform.common.utils.DateTimeUtils;
import com.sephora.platform.database.cosmosdb.exception.CosmosDBAccessException;
import com.sephora.services.inventory.exception.NotFoundException;
import com.sephora.services.inventory.model.EnterpriseCodeEnum;
import com.sephora.services.inventory.model.doc.Inventory;
import com.sephora.services.inventory.model.dto.UpdateInfiniteStatusDto;
import com.sephora.services.inventory.model.dto.UpdateInventoryDto;
import com.sephora.services.inventory.repository.cosmos.CosmosInventoryRepository;
import com.sephora.services.inventory.util.InventoryUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/*import static com.sephora.services.commons.util.DateTimeUtils.PST;*/
import static com.sephora.services.inventory.service.InventoryShipNodeService.SHIP_NODE_WITH_ENTERPRISE_NOT_FOUND_ERROR;
import static java.util.stream.Collectors.toList;

/**
 * @author Vitaliy Oleksiyenko
 */
@Service
public class UpdateInventoryService {

    public static final long DEFAULT_UPDATE_INVENTORY_TIMEOUT_MS = 100L;
    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired(required = false)
    private CosmosInventoryRepository inventoryRepository;

    @Autowired
    private ExecutorService executorService;

    @Autowired
    private InventoryShipNodeService shipNodeService;

    @Autowired
    private DateTimeProvider dateTimeProvider;

    public void updateInventory(@NonNull UpdateInventoryDto updateInventoryDto) throws InterruptedException {

        List<Inventory> inventoryList = updateInventoryDto.getInventories();

        if (CollectionUtils.isNotEmpty(inventoryList)) {

            // validate ship nodes existence
            List<String> allShipNodes = shipNodeService.findByEnterpriseCode(updateInventoryDto.getEnterpriseCode());
            List<String> requestShipNodes = inventoryList.stream().map(inv -> inv.getShipNode()).collect(toList());
            requestShipNodes.stream().filter(node -> !allShipNodes.contains(node)).findFirst()
                    .ifPresent((node) -> {
                        logger.error("Unable to find shipNode with key={} and enterpriseCode={}", node,
                                updateInventoryDto.getEnterpriseCode());
                        throw new NotFoundException(SHIP_NODE_WITH_ENTERPRISE_NOT_FOUND_ERROR, node,
                                updateInventoryDto.getEnterpriseCode());
                    });

            List<Callable<Void>> futureReturnTypes = createCallableList(inventoryList);

            List<Future<Void>> futureReturnResults = executorService.invokeAll(futureReturnTypes);

            updateInventories(futureReturnResults);

        }
    }

    private void updateInventories(List<Future<Void>> futureReturnResults) {
        futureReturnResults
                .stream()
                .forEach(future -> {
                        try {
                            future.get(DEFAULT_UPDATE_INVENTORY_TIMEOUT_MS, TimeUnit.MILLISECONDS);
                        } catch (Exception e) {
                            logger.error(e);
                            throw new CompletionException(e);
                        }
                    }
                );
    }

    private List<Callable<Void>> createCallableList(List<Inventory> inventoryList) {
        return inventoryList
                .stream()
                .map(inventory -> {
                    Callable<Void> callable = () -> {
                        try {
                            long startTime = System.currentTimeMillis();
                            updateInventoryWithTrigger(inventory);
                            logger.info("Inventory Update for [itemId: {}, shipNode: {}] took {}ms",
                                    inventory.getItemId(), inventory.getShipNode(),
                                    System.currentTimeMillis() - startTime);
                        } catch (Exception e) {
                            throw new CompletionException(e);
                        } finally {
                            return null;
                        }
                    };
                    return callable;
                })
                .collect(Collectors.toList());
    }

    public void updateInventoryWithTrigger(Inventory inventory)  {
        try {
            inventoryRepository.upsertWithTrigger(inventory);
        } catch (CosmosAccessException e) {
            if (e.getCause() != null && e.getCause().getCause() instanceof BadRequestException){
                BadRequestException exception =  (BadRequestException)e.getCause().getCause();
                logger.debug("Error during inventory upsert", e);
                logger.warn("Inventory item={} for itemId={} not updated. Error message: {}",
                        inventory.getId(), inventory.getItemId(), exception.getMessage());

            } else {
                throw e;
            }
        }
    }

    public void updateInfiniteStatus(@NonNull UpdateInfiniteStatusDto updateInfiniteStatusDto, String itemId) {
        removeItem(updateInfiniteStatusDto, itemId);
        if (BooleanUtils.isTrue(updateInfiniteStatusDto.getIsInfinite())) {
            createInfiniteInventoryItem(updateInfiniteStatusDto, itemId);
        }
    }

    private void removeItem(UpdateInfiniteStatusDto updateInfiniteStatusDto, String itemId) {
        inventoryRepository.deleteByItemIdAndEnterpriseCodeAndInfinite(itemId,
                EnterpriseCodeEnum.valueOf(updateInfiniteStatusDto.getEnterpriseCode()),
                !updateInfiniteStatusDto.getIsInfinite());
    }

    private void createInfiniteInventoryItem(UpdateInfiniteStatusDto updateInfiniteStatusDto, String itemId) {
        String enterpriseCode = updateInfiniteStatusDto.getEnterpriseCode();
        EnterpriseCodeEnum enterpriseCodeEnum = EnterpriseCodeEnum.valueOf(enterpriseCode);

        logger.info("Create infinite inventory for itemId={} and enterpriseCode={}",
                itemId, enterpriseCode);

        // Get or create inventory with infinite = true for enterpriseCode
        List<Inventory> inventoryList = inventoryRepository.findByItemIdAndEnterpriseCodeAndInfinite(itemId,
                enterpriseCodeEnum, Boolean.TRUE);
        if (CollectionUtils.isEmpty(inventoryList)) {
            Inventory inventory = Inventory.Builder.anInventory()
                    .withItemId(itemId)
                    .withEnterpriseCode(enterpriseCode)
                    .withShipNode(InventoryUtils.getInfiniteShipNodeName(enterpriseCode))
                    .withQuantity(null)
                    .withThreshold(null)
                    .withInfinite(Boolean.TRUE)
                    .withModifyTimestamp(dateTimeProvider.longZonedDateTimeNow(DateTimeUtils.PST))
                    .build();

            inventoryRepository.save(inventory);
        } else {
            logger.info("Update not required because infinite inventory already exist for itemId={} and enterpriseCode={}",
                    itemId, enterpriseCode);
        }
    }
}