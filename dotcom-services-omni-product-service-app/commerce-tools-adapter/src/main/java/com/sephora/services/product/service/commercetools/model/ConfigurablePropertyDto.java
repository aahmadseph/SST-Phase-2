package com.sephora.services.product.service.commercetools.model;

import com.sephora.services.product.model.ConfigurableProperty;
import com.sephora.services.product.model.ConfigurationOption;
import org.apache.commons.collections4.CollectionUtils;

import java.io.Serial;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class ConfigurablePropertyDto extends ValueMapDto implements ConfigurableProperty {

    @Serial
    private static final long serialVersionUID = 7830632190818249147L;

    private static final String DISPLAY_NAME = "displayName";
    private static final String TITLE = "title";
    private static final String DESCRIPTION = "description";
    private static final String IMAGE_PATH = "imagePath";
    private static final String IMAGE_COPY = "imageCopy";
    private static final String CONFIGURATION_OPTIONS = "configurationOptions";
    public static final String FREE = "free";

    private final String configurablePropertyId;

    public ConfigurablePropertyDto(Map<String, Object> valueMap, String configurablePropertyId) {
        super(valueMap);
        this.configurablePropertyId = configurablePropertyId;
    }

    @Override
    public String getConfigurablePropertyId() {
        return configurablePropertyId;
    }

    @Override
    public String getDisplayName() {
        return getValue(DISPLAY_NAME);
    }

    @Override
    public String getTitle() {
        return getValue(TITLE);
    }

    @Override
    public String getDescription() {
        return getValue(DESCRIPTION);
    }

    @Override
    public String getImagePath() {
        return getValue(IMAGE_PATH);
    }

    @Override
    public String getImageCopy() {
        return getValue(IMAGE_COPY);
    }

    @Override
    public Boolean isFree() {
        return getValue(FREE);
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<ConfigurationOption> getConfigurationOptions() {
        Object configurationOptions = getValue(CONFIGURATION_OPTIONS);
        if (configurationOptions instanceof Collection<?> configurationOptionsCollection) {
            if (CollectionUtils.isNotEmpty(configurationOptionsCollection)) {
                List<ConfigurationOption> configurationOptionList = new ArrayList<>(configurationOptionsCollection.size());
                for (Object option : configurationOptionsCollection) {
                    if (option instanceof Map<?, ?> optionMap) {
                        configurationOptionList.add(new ConfigurationOptionDto((Map<String, Object>) optionMap));
                    }
                }
                return configurationOptionList;
            }
        }
        return List.of();
    }

}
