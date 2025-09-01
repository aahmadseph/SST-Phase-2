package com.sephora.services.product.service.commercetools.utils;

import com.commercetools.api.models.common.LocalizedString;
import com.commercetools.api.models.custom_object.CustomObjectReferenceImpl;
import com.commercetools.api.models.product.Attribute;
import com.commercetools.api.models.product.AttributesAccessor;
import com.commercetools.api.models.product_type.AttributePlainEnumValue;
import com.sephora.services.product.model.StandardCountryEnum;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;

@UtilityClass
@Slf4j
public class AttributeUtils {

    public static final Locale DEFAULT_LOCALE = Locale.US;
    public static final AttributesAccessor EMPTY_ATTRIBUTE_ACCESSOR = AttributesAccessor.of(Collections.emptyMap());

    public static String getAttributeValueFromEnum(AttributePlainEnumValue attributePlainEnum) {
        return nonNull(attributePlainEnum) ? attributePlainEnum.getKey() : StringUtils.EMPTY;
    }

    public static Set<String> getAttributeSetFromEnumSet(List<AttributePlainEnumValue> attributePlainEnumValues) {
        return getAttributeSetFromEnumSet(attributePlainEnumValues, Function.identity());
    }

    public static Set<StandardCountryEnum> getCountrySetFromEnumSet(List<AttributePlainEnumValue> attributePlainEnumValues) {
        return getAttributeSetFromEnumSet(attributePlainEnumValues, StandardCountryEnum::fromString);
    }

    public static <T> Set<T> getAttributeSetFromEnumSet(List<AttributePlainEnumValue> attributePlainEnumValues,
                                                        Function<String, T> mapper) {
        return Optional.ofNullable(attributePlainEnumValues)
                .orElseGet(Collections::emptyList)
                .stream()
                .map(AttributePlainEnumValue::getKey)
                .map(mapper)
                .collect(Collectors.toSet());
    }

    public static Double getDoubleAttributeValue(final Attribute attribute) {
        return nonNull(attribute) && nonNull(attribute.getValue()) ? ((Number) attribute.getValue()).doubleValue() : null;
    }

    public static Long getLongAttributeValue(final Attribute attribute) {
        return nonNull(attribute) && nonNull(attribute.getValue()) ? ((Number) attribute.getValue()).longValue() : null;
    }

    public static String getFromLocalizedString(LocalizedString localizedString, Locale locale) {
        if (localizedString == null) {
            return null;
        }
        if (locale == null || DEFAULT_LOCALE.equals(locale)) {
            return localizedString.get(DEFAULT_LOCALE);
        }
        return localizedString.find(locale)
                .orElse(localizedString.get(DEFAULT_LOCALE));
    }

    public static String getFromLocalizedMap(Map<String, String> map, Locale locale) {
        if (MapUtils.isEmpty(map)) {
            return null;
        }
        if (locale == null || DEFAULT_LOCALE.equals(locale)) {
            return map.get(DEFAULT_LOCALE.toLanguageTag());
        }

        return map.getOrDefault(locale.toLanguageTag(), map.get(DEFAULT_LOCALE.toLanguageTag()));
    }

    public static <T> T getFirstOrNull(List<T> list) {
        return CollectionUtils.isNotEmpty(list) ? list.getFirst() : null;
    }

    public static String getCustomObjectReferenceKey(Attribute attribute) {
        if (nonNull(attribute)
                && nonNull(attribute.getValue())
                && attribute.getValue() instanceof CustomObjectReferenceImpl customObjectReference
                && nonNull(customObjectReference.getObj())) {
            return customObjectReference.getObj().getKey();
        }
        return null;
    }

}
