package com.sephora.services.product.model;

import java.io.Serializable;

public interface Badge extends Serializable {

    String getBadgeId();

    String getName();

    String getAltText();

    String getImageUrl();
}
