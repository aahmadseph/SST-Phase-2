package com.sephora.services.product.model;

import java.io.Serializable;

public interface Image extends Serializable {

    String getImageId();

    String getAltText();

    String getBaseUrl();

    Long getSequenceNumber();
}
