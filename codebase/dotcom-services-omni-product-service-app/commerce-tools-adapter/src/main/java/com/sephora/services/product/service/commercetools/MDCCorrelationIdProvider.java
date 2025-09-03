package com.sephora.services.product.service.commercetools;

import com.sephora.services.product.utils.MDCUtils;
import io.vrap.rmf.base.client.http.CorrelationIdProvider;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
public class MDCCorrelationIdProvider implements CorrelationIdProvider {

    private final String projectKey;

    public static MDCCorrelationIdProvider of(String projectKey) {
        return new MDCCorrelationIdProvider(projectKey);
    }

    @Override
    public String getCorrelationId() {
        return Optional.ofNullable(MDCUtils.getCorrelationId())
                .orElse(generateCorrelationId());
    }

    private String generateCorrelationId() {
        return this.projectKey + "/" + UUID.randomUUID();
    }
}
