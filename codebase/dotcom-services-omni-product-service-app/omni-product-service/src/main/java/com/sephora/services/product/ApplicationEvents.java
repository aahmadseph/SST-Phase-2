package com.sephora.services.product;

import com.sephora.services.product.service.commercetools.service.ProductTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApplicationEvents {

    private final ProductTypeService productTypeService;

    @EventListener(ApplicationReadyEvent.class)
    public void runAfterStartup() {
        productTypeService.loadProductTypes();
    }
}
