package com.sephora.services.product.service.commercetools.model;

import com.sephora.services.product.model.Image;
import com.sephora.services.product.service.commercetools.utils.CustomObjectUtils;

import java.io.Serial;
import java.util.Map;

public class ImageDto extends ValueMapDto implements Image {

    @Serial
    private static final long serialVersionUID = -5524430171169345177L;

    private static final String SEQUENCE_NUMBER = "sequenceNumber";
    private static final String ALT_TEXT = "altText";
    private static final String BASE_URL = "baseUrl";

    private final String imageId;

    public ImageDto(Map<String, Object> valueMap, String imageId) {
        super(valueMap);
        this.imageId = imageId;
    }

    @Override
    public String getImageId() {
        return imageId;
    }

    @Override
    public String getAltText() {
        return getValue(ALT_TEXT);
    }

    @Override
    public String getBaseUrl() {
        return getValue(BASE_URL);
    }

    @Override
    public Long getSequenceNumber() {
        return CustomObjectUtils.getSequenceNumber(getValueMap(), SEQUENCE_NUMBER);
    }
}
