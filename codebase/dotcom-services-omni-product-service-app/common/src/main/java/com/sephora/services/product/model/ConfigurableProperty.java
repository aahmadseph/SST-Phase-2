package com.sephora.services.product.model;

import java.io.Serializable;
import java.util.List;

public interface ConfigurableProperty extends Serializable {

    String getConfigurablePropertyId();

    String getDisplayName();

    String getTitle();

    String getDescription();

    String getImagePath();

    String getImageCopy();

    Boolean isFree();

    List<ConfigurationOption> getConfigurationOptions();
}
