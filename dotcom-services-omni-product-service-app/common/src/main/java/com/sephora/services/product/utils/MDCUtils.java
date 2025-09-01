package com.sephora.services.product.utils;

import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.MDC;

import java.util.Optional;
import java.util.UUID;

@UtilityClass
public class MDCUtils {

    public static final String CORRELATION_ID_MDC_KEY = "correlationId";
    public static final String COLON = ":";

    public static String getCorrelationId() {
        return normalizeCorrelationId(Optional.ofNullable(MDC.get(CORRELATION_ID_MDC_KEY))
                .orElse(UUID.randomUUID().toString()));
    }

    public static String normalizeCorrelationId(String correlationId) {
        return correlationId != null ? correlationId.replaceAll(COLON, StringUtils.EMPTY) : null;
    }
}