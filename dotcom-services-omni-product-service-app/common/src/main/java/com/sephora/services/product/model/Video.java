package com.sephora.services.product.model;

import java.io.Serializable;
import java.util.Set;

public interface Video extends Serializable {

    String getVideoId();

    Long getSequenceNumber();

    String getBrightcoveId();

    String getTitle();

    String getFileName();

    String getWebStartImage();

    String getMobileWebStartImage();

    String getStartDate();

    String getEndDate();

    Set<String> getAvailableLocales();
}
