package com.sephora.services.inventory.controller;

import com.sephora.services.inventory.model.dto.*;
import com.sephora.services.inventory.service.InventoryServiceException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.hibernate.validator.constraints.Length;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;
import java.util.List;

import static com.sephora.services.inventory.validation.ValidationConstants.ITEM_ID_MAX_LENGTH;
import static com.sephora.services.inventory.validation.ValidationConstants.SHIP_NODE_KEY_MAX_LENGTH;

@Api(tags = "Inventory Items API", description = "API to work with Inventory Items")
public interface InventoryController {

    String INVENTORY_NOT_FOUND_ERROR = "inventory.item.notFound";
    String INVENTORY_ITEMS_NOT_FOUND_ERROR = "inventory.items.notFound";
    String INVENTORY_ITEM_ID_EXCEEDED_LENGTH_ERROR = "inventory.item.exceededLength";
    String INVENTORY_BY_SHIP_NODE_NOT_FOUND_ERROR = "inventory.itemByShipNode.notFound";
    String INVENTORY_SHIP_NODE_EXCEEDED_LENGTH_ERROR = "inventory.shipNode.exceededLength";

    @ApiOperation(value = "${InventoryController.findAll.value}",
            notes = "${InventoryController.findAll.notes}")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Inventory items details", response = List.class),
    })
    ResponseEntity<Object> findAll();


    @ApiOperation(value = "${InventoryController.getAvailability.value}",
            notes = "${InventoryController.getAvailability.notes}")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Inventory Item details", response = GetInventoryItemDetailsDto.class),
            @ApiResponse(code = 400, message = "Invalid Inventory Item ID", response = ErrorListDto.class),
            @ApiResponse(code = 404, message = "Inventory Item with ID is not found", response = ErrorListDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class)
    })
    ResponseEntity<Object> getAvailability(
            @ApiParam(
                    value = "${InventoryController.getAvailability.param.itemID.value}",
                    required = true)
            @Length(max = ITEM_ID_MAX_LENGTH, message = INVENTORY_ITEM_ID_EXCEEDED_LENGTH_ERROR)
            @PathVariable("itemId") String itemId) throws InventoryServiceException;


    @ApiOperation(value = "${InventoryController.getAvailabilityByNode.value}",
            notes = "${InventoryController.getAvailabilityByNode.notes}")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Inventory Item details", response = GetInventoryItemDetailsDto.class),
            @ApiResponse(code = 400, response = ErrorListDto.class,
                    message = "The field-s {itemId} length must be less than or equal to 40 symbols\n" +
                              "The field-s {nodeName} length must be less than or equal to 40 symbols"),
            @ApiResponse(code = 404, message = "Inventory Item with ID and node name is not found", response = ErrorListDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class)
    })
    ResponseEntity<Object> getAvailabilityByShipNode(
            @ApiParam(
                    value = "${InventoryController.getAvailabilityByNode.param.itemID.value}",
                    required = true)
            @Length(max = ITEM_ID_MAX_LENGTH, message = INVENTORY_ITEM_ID_EXCEEDED_LENGTH_ERROR)
            @PathVariable("itemId") String itemId,
            @ApiParam(
                    value = "${InventoryController.getAvailabilityByNode.param.nodeName.value}",
                    required = true)
            @Length(max = SHIP_NODE_KEY_MAX_LENGTH, message = INVENTORY_SHIP_NODE_EXCEEDED_LENGTH_ERROR)
            @PathVariable("nodeName") String nodeName) throws InventoryServiceException;


    @ApiOperation(value = "${InventoryController.updateInventory.value}",
            notes = "${InventoryController.updateInventory.notes}")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Inventory item updated successfully"),
            @ApiResponse(code = 400, response = ErrorListDto.class,
                    message = "The field 'itemId' cannot be null or blank\n" +
                            "The field 'itemId' element length must be less than or equal to 40 symbols\n" +
                            "The field 'threshold' cannot be null or blank\n" +
                            "The field 'threshold' length must be less than or equal to 24 symbols\n" +
                            "The field 'isInfinite' must have boolean value\n" +
                            "The field 'availability' must have at least 1 element when field 'isInfinite' is false\n" +
                            "The field 'availability.shipNode' cannot be null or blank\n" +
                            "The field 'availability.shipNode' must be less than or equal to 40 symbols\n" +
                            "The field 'availability.quantity' cannot be null\n" +
                            "The field 'availability.quantity' must be a number\n" +
                            "The field 'availability.quantity' must be more than or equal to '0'\n" +
                            "The field 'availability.modifyts' cannot be null\n" +
                            "The field 'availability.modifyts' is not in the correct ISO-8601 format 'yyyy-MM-dd'T'HH:mm:ss.SSSXXX'\n" +
                            "The field 'enterpriseCode' cannot be null or blank\n" +
                            "The enterpriseCode value provided is not an identified one. List of possible channel values: 'SEPHORAUS', 'SEPHORACA'\n"
            ),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class)
    })
    ResponseEntity<Object> updateInventory(
            @ApiParam(
                    name = "UpdateInventoryDto" ,
                    value = "${InventoryController.updateInventory.param.value}",
                    required = true)
            @Valid UpdateInventoryDto updateInventoryDto) throws InventoryServiceException;


    @ApiOperation(value = "${InventoryController.updateInfiniteStatus.value}",
            notes = "${InventoryController.updateInfiniteStatus.notes}")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Inventory item updated successfully"),
            @ApiResponse(code = 400, response = ErrorListDto.class,
                    message = "The field 'itemId' length must be less than or equal to 40 symbols\n" +
                            "The field 'enterpriseCode' cannot be null or blank\n" +
                            "The field 'enterpriseCode' value provided is not an identified one. List of possible channel values: 'SEPHORAUS', 'SEPHORACA'\n" +
                            "The field 'isInfinite' cannot be null or blank\n" +
                            "The field 'isInfinite' must have boolean value"
            ),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorListDto.class)
    })
    ResponseEntity<Object> updateInfiniteStatus(
            @ApiParam(
                    name = "UpdateInfiniteStatusDto" ,
                    value = "${InventoryController.updateInfiniteStatus.param.value}",
                    required = true)
            @Valid UpdateInfiniteStatusDto updateInfiniteStatusDto,
            @ApiParam(
                    value = "${InventoryController.updateInfiniteStatus.param.itemId.value}",
                    required = true)
            @Length(max = ITEM_ID_MAX_LENGTH, message = "{Length.updateInfiniteStatus.itemId}")
                    String itemId) throws InventoryServiceException;


    @ApiOperation(value = "${InventoryController.getItemsInventoryAvailability.value}",
                  notes = "${InventoryController.getItemsInventoryAvailability.notes}")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Promotion validation details", response = InventoryResponseDto.class),
        @ApiResponse(code = 400, response = ErrorListDto.class,
                     message = "The field 'items' must have at least 1 element\n" +
                               "The 'items' element-s length must be less than or equal to 40 symbols\n" +
                               "The 'shipNodes' element-s length must be less than or equal to 40 symbols"
        ),
        @ApiResponse(code = 404, message = "Requested inventory items by given shipNodes not found in DB", response = ErrorListDto.class)

    })
    ResponseEntity<Object> getItemsInventoryAvailability(
        @ApiParam(
            name = "Inventory",
            value = "${InventoryController.getItemsInventoryAvailability.param.value}",
            required = true)
        @Valid @RequestBody GetInventoryAvailabilityDto inventoryAvailabilityBean) throws InventoryServiceException;
}
