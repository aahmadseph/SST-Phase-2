package com.sephora.services.product.service.commercetools.model;

import com.sephora.services.product.model.Highlight;

import java.io.Serial;
import java.util.Locale;
import java.util.Map;

import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getFromLocalizedMap;

public class HighlightDto extends ValueMapDto implements Highlight {

    @Serial
    private static final long serialVersionUID = -4148837117115520622L;

    private static final String NAME = "name";
    private static final String DESCRIPTION = "description";
    private static final String ALT_TEXT = "altText";
    private static final String IMAGE_URL = "imageUrl";
    private static final String APPS_IMAGE_URL = "appsImageUrl";

    private final String highlightId;
    private final Locale locale;

    public HighlightDto(Map<String, Object> valueMap, Locale locale, String highlightId) {
        super(valueMap);
        this.locale = locale;
        this.highlightId = highlightId;
    }

    @Override
    public String getHighlightId() {
        return highlightId;
    }

    @Override
    public String getName() {
        return getFromLocalizedMap(getValue(NAME), locale);
    }

    @Override
    public String getAltText() {
        return getFromLocalizedMap(getValue(ALT_TEXT), locale);
    }

    @Override
    public String getImageUrl() {
        return getValue(IMAGE_URL);
    }

    @Override
    public String getDescription() {
        return getFromLocalizedMap(getValue(DESCRIPTION), locale);
    }

    @Override
    public String getAppsImageUrl() {
        return getValue(APPS_IMAGE_URL);
    }

}
