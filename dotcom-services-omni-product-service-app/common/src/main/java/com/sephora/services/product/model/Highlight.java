package com.sephora.services.product.model;

import java.io.Serializable;

public interface Highlight extends Serializable {

    String getHighlightId();

    String getName();

    String getDescription();

    String getAltText();

    String getImageUrl();

    String getAppsImageUrl();
}
