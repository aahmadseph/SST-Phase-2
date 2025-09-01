package com.sephora.services.product.service.commercetools.model;

import com.sephora.services.product.model.Badge;

import java.io.Serial;
import java.util.Locale;
import java.util.Map;

import static com.sephora.services.product.service.commercetools.utils.AttributeUtils.getFromLocalizedMap;

public class BadgeDto extends ValueMapDto implements Badge {

    @Serial
    private static final long serialVersionUID = 6960165872858449682L;

    private static final String NAME = "name";
    private static final String ALT_TEXT = "altText";
    private static final String IMAGE_URL = "imageUrl";

    private final String badgeId;

    private final Locale locale;

    public BadgeDto(Map<String, Object> valueMap, Locale locale, String badgeId) {
        super(valueMap);
        this.badgeId = badgeId;
        this.locale = locale;
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
    public String getBadgeId() {
        return badgeId;
    }
}
