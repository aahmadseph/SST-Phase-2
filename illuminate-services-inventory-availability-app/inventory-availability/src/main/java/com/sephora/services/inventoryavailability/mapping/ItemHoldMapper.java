package com.sephora.services.inventoryavailability.mapping;

import com.sephora.services.inventoryavailability.model.itemhold.cache.ItemHoldUpdateCacheDto;
import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateProduct;
import org.mapstruct.*;

@Mapper
public interface ItemHoldMapper {

    @Mapping(source="onhold", target="onHold")
    ItemHoldUpdateCacheDto convert(ItemHoldUpdateProduct product, @Context String sellingChannel);

    @AfterMapping
    default ItemHoldUpdateCacheDto afterConversion(ItemHoldUpdateProduct product,
                                                   @MappingTarget ItemHoldUpdateCacheDto response,
                                                   @Context String sellingChannel){
        response.setSellingChannel(sellingChannel);
        return response;
    }
}
