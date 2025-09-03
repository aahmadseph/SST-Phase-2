package com.sephora.services.product.service.commercetools.model;

import com.sephora.services.product.model.Video;
import com.sephora.services.product.service.commercetools.utils.CustomObjectUtils;
import org.apache.commons.collections4.CollectionUtils;

import java.io.Serial;
import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class VideoDto extends ValueMapDto implements Video {

    @Serial
    private static final long serialVersionUID = 5611258978989352230L;

    private static final String VIDEO_TITLE = "title";
    private static final String VIDEO_FILE_NAME = "fileName";
    private static final String VIDEO_BRIGHTCOVE_ID = "brightcoveId";
    private static final String VIDEO_WEB_IMAGE = "webStartImage";
    private static final String VIDEO_MOBILE_IMAGE = "mobileWebStartImage";
    private static final String VIDEO_START_DATE = "startDate";
    private static final String VIDEO_END_DATE = "endDate";
    private static final String SEQUENCE_NUMBER = "sequenceNumber";
    private static final String VIDEO_AVAILABLE_LOCALES = "availableLocales";

    private final String videoId;

    public VideoDto(Map<String, Object> valueMap, String videoId) {
        super(valueMap);
        this.videoId = videoId;
    }

    @Override
    public String getVideoId() {
        return videoId;
    }

    @Override
    public Long getSequenceNumber() {
        return CustomObjectUtils.getSequenceNumber(getValueMap(), SEQUENCE_NUMBER);
    }

    @Override
    public String getBrightcoveId() {
        return getValue(VIDEO_BRIGHTCOVE_ID);
    }

    @Override
    public String getTitle() {
        return getValue(VIDEO_TITLE);
    }

    @Override
    public String getFileName() {
        return getValue(VIDEO_FILE_NAME);
    }

    @Override
    public String getWebStartImage() {
        return getValue(VIDEO_WEB_IMAGE);
    }

    @Override
    public String getMobileWebStartImage() {
        return getValue(VIDEO_MOBILE_IMAGE);
    }

    @Override
    public String getStartDate() {
        return getValue(VIDEO_START_DATE);
    }

    @Override
    public String getEndDate() {
        return getValue(VIDEO_END_DATE);
    }

    @Override
    public Set<String> getAvailableLocales() {
        Collection<String> collection = getValue(VIDEO_AVAILABLE_LOCALES);
        if (CollectionUtils.isNotEmpty(collection)) {
            return new HashSet<>(collection);
        }
        return null;
    }
}
