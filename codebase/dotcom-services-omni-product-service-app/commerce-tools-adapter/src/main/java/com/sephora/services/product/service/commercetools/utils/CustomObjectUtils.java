package com.sephora.services.product.service.commercetools.utils;

import com.commercetools.api.models.common.Reference;
import com.commercetools.api.models.custom_object.CustomObject;
import com.commercetools.api.models.custom_object.CustomObjectReference;
import com.sephora.services.product.model.Badge;
import com.sephora.services.product.model.ConfigurableProperty;
import com.sephora.services.product.model.Highlight;
import com.sephora.services.product.model.Image;
import com.sephora.services.product.model.ReplenishmentPlan;
import com.sephora.services.product.model.StandardCountryEnum;
import com.sephora.services.product.model.Video;
import com.sephora.services.product.service.commercetools.model.BadgeDto;
import com.sephora.services.product.service.commercetools.model.ConfigurablePropertyDto;
import com.sephora.services.product.service.commercetools.model.HighlightDto;
import com.sephora.services.product.service.commercetools.model.ImageDto;
import com.sephora.services.product.service.commercetools.model.ReplenishmentPlanDto;
import com.sephora.services.product.service.commercetools.model.VideoDto;
import lombok.experimental.UtilityClass;
import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Objects.nonNull;

@UtilityClass
public class CustomObjectUtils {

    public static <R> List<R> convertToBeansFromValueMapWithRefKey(List<Reference> references,
                                                                   BiFunction<Map<String, Object>, String, ? extends R> beanMapper) {

        List<R> beans = new ArrayList<>();
        Stream.ofNullable(references)
                .flatMap(Collection::stream)
                .map(CustomObjectReference.class::cast)
                .map(CustomObjectReference::getObj)
                .forEach(
                        customObject ->
                                beans.add(beanMapper.apply(getValueObjectMap(customObject), customObject.getKey()))
                );

        return beans;
    }

    public static <R> List<R> convertToBeansFromValueMapWithRefKeyAndSort(List<Reference> references,
                                                                          BiFunction<Map<String, Object>, String, ? extends R> beanMapper,
                                                                          Function<R, Long> sequenceNumberExtractor) {

        List<R> beans = new ArrayList<>();
        Stream.ofNullable(references)
                .flatMap(Collection::stream)
                .map(CustomObjectReference.class::cast)
                .map(CustomObjectReference::getObj)
                .forEach(
                        customObject ->
                                beans.add(beanMapper.apply(getValueObjectMap(customObject), customObject.getKey()))
                );
        beans.sort(Comparator.comparing(sequenceNumberExtractor, Comparator.nullsLast(Comparator.naturalOrder())));
        return beans;
    }

    public static <R> List<R> convertToBeansFromValueMapWithRefKeySortAndFilter(List<Reference> references,
                                                                                BiFunction<Map<String, Object>, String, ? extends R> beanMapper,
                                                                                Function<R, Long> sequenceNumberExtractor,
                                                                                Predicate<R> filter) {

        List<R> beans = new ArrayList<>();
        Stream.ofNullable(references)
                .flatMap(Collection::stream)
                .map(CustomObjectReference.class::cast)
                .map(CustomObjectReference::getObj)
                .forEach(
                        customObject -> {
                            var bean = beanMapper.apply(getValueObjectMap(customObject), customObject.getKey());
                            if (filter.test(bean)) {
                                beans.add(bean);
                            }
                        }
                );
        beans.sort(Comparator.comparing(sequenceNumberExtractor, Comparator.nullsLast(Comparator.naturalOrder())));
        return beans;
    }

    public static <R> R convertToBeanFromValueMapWithRefKey(Reference reference,
                                                            BiFunction<Map<String, Object>, String, R> beanMapper) {

        return Optional.ofNullable(reference)
                .map(CustomObjectReference.class::cast)
                .map(CustomObjectReference::getObj)
                .map(customObject ->
                        beanMapper.apply(getValueObjectMap(customObject), customObject.getKey())
                )
                .orElse(null);
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> getValueObjectMap(CustomObject customObject) {
        return nonNull(customObject) ? (Map<String, Object>) customObject.getValue() : Collections.emptyMap();
    }

    public static List<Badge> convertToBadges(List<Reference> references, Locale locale) {
        return CustomObjectUtils.convertToBeansFromValueMapWithRefKey(
                references, (valueMap, id) -> new BadgeDto(valueMap, locale, id));
    }

    public static List<Image> convertToImages(List<Reference> references) {
        return CustomObjectUtils.convertToBeansFromValueMapWithRefKeyAndSort(references,
                ImageDto::new,
                Image::getSequenceNumber);
    }

    public static Long getSequenceNumber(Map<String, Object> valueMap, String key) {
        return valueMap.get(key) instanceof String
                ? Long.valueOf((String) valueMap.get(key))
                : (Long) valueMap.get(key);
    }

    public static List<Video> convertToProductVideos(List<Reference> references, Locale locale) {
        return CustomObjectUtils.convertToBeansFromValueMapWithRefKeySortAndFilter(references,
                VideoDto::new,
                Video::getSequenceNumber,
                video -> {
                    var availableLocales = video.getAvailableLocales();
                    return CollectionUtils.isNotEmpty(availableLocales) &&
                            availableLocales.contains(locale.toLanguageTag());
                });
    }

    public static List<Highlight> convertToHighlights(List<Reference> references, Locale locale) {
        return CustomObjectUtils.convertToBeansFromValueMapWithRefKey(references,
                (valueMap, id) -> new HighlightDto(valueMap, locale, id));
    }

    public static ReplenishmentPlan convertToReplenishmentPlan(Reference reference) {
        return CustomObjectUtils.convertToBeanFromValueMapWithRefKey(reference, ReplenishmentPlanDto::new);
    }

    public static ConfigurableProperty convertToConfigurableProperty(Reference reference) {
        return CustomObjectUtils.convertToBeanFromValueMapWithRefKey(reference,
                ConfigurablePropertyDto::new);
    }

    public static Set<StandardCountryEnum> fromCollection(Collection<String> collection) {
        if (CollectionUtils.isEmpty(collection)) {
            return Set.of();
        }
        return collection.stream()
                .map(StandardCountryEnum::fromString)
                .collect(Collectors.toSet());
    }

}
