package com.sephora.services.product.utils;

import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;

@UtilityClass
public class EnumUtils {

    public static final Pattern WHITE_SPACE_PATTERN = Pattern.compile("\\s+");

    public static final Function<String, String> LOWER_CASE_WITHOUT_WHITE_SPACES_FUNCTION =
            (str) -> WHITE_SPACE_PATTERN.matcher(StringUtils.lowerCase(str)).replaceAll(StringUtils.EMPTY);

    public static final Function<String, String> LOWER_CASE_FUNCTION =
            StringUtils::lowerCase;

    /**
     * Returns a map of enum names in lower case to enum values for the given enum class.
     *
     * @param enumClass enum class
     * @param <T>       enum type
     * @return map of enum names to enum values
     */
    public static <T extends Enum<T>> Map<String, T> getEnumMap(Class<T> enumClass) {
        return Arrays.stream(enumClass.getEnumConstants())
                .collect(Collectors.toMap(e -> e.name().toLowerCase(), Function.identity()));
    }

    public static <T extends Enum<T>, V> Map<V, T> getEnumMapWithType(Class<T> enumClass, Function<T, V> valueFunction) {
        return Arrays.stream(enumClass.getEnumConstants())
                .collect(Collectors.toMap(valueFunction, Function.identity()));
    }

    public static <T extends Enum<T>, V> Map<String, T> getEnumMapWithMultiType(Class<T> enumClass,
                                                                                Function<T, Collection<V>> multiValueFunction,
                                                                                Function<V, String> keyFunction) {
        Map<String, T> enumMap = new HashMap<>();
        for (T enumConstant : enumClass.getEnumConstants()) {
            Collection<V> values = multiValueFunction.apply(enumConstant);
            if (values != null) {
                for (V value : values) {
                    if (value != null) {
                        enumMap.put(keyFunction.apply(value), enumConstant);
                    }
                }
            }
        }
        return enumMap;
    }

    public static <T extends Enum<T>> Map<String, T> getEnumMap
            (Class<T> enumClass, Function<T, String> keyFunction) {
        return Arrays.stream(enumClass.getEnumConstants())
                .collect(Collectors.toMap(keyFunction, Function.identity()));
    }

    public static <T extends Enum<T>> Map<String, T> getEnumMapWithIgnoreWhitespace(Class<T> enumClass,
                                                                                    Function<T, String> keyFunction) {
        return Arrays.stream(enumClass.getEnumConstants())
                .filter(t -> StringUtils.isNotEmpty(keyFunction.andThen(LOWER_CASE_WITHOUT_WHITE_SPACES_FUNCTION).apply(t)))
                .collect(Collectors.toMap(keyFunction.andThen(LOWER_CASE_WITHOUT_WHITE_SPACES_FUNCTION), Function.identity()));
    }

    public static <T extends Enum<T>> Map<String, T> getEnumMapWithIgnoreEmpty(Class<T> enumClass,
                                                                               Function<T, String> keyFunction) {
        return Arrays.stream(enumClass.getEnumConstants())
                .filter(t -> StringUtils.isNotEmpty(keyFunction.andThen(LOWER_CASE_WITHOUT_WHITE_SPACES_FUNCTION).apply(t)))
                .collect(Collectors.toMap(keyFunction.andThen(LOWER_CASE_FUNCTION), Function.identity()));
    }

    public static <T extends Enum<T>> Map<String, T> getEnumMapWithKeyFunction(Class<T> enumClass,
                                                                               Function<T, String> keyFunction) {
        return Arrays.stream(enumClass.getEnumConstants())
                .filter(t -> StringUtils.isNotEmpty(keyFunction.apply(t)))
                .collect(Collectors.toMap(keyFunction.andThen(LOWER_CASE_WITHOUT_WHITE_SPACES_FUNCTION), Function.identity()));
    }

    public static <T extends Enum<T>> T fromString(String
                                                           value, Map<String, T> enumMap, Function<String, String> keyFunction) {
        return enumMap.get(keyFunction.apply(value));
    }

    public static <T extends Enum<T>> T fromString(String value, Map<String, T> enumMap) {
        return fromString(value, enumMap, Function.identity());
    }

    /**
     * Returns the enum value corresponding to the given string value, using a map of enum names in lower case.
     *
     * @param value   string value
     * @param enumMap map of enum names to enum values
     * @param <T>     enum type
     * @return corresponding enum value or null if not found
     */
    public static <T extends Enum<T>> T fromStringToLowerCase(String value, Map<String, T> enumMap) {
        return fromString(value, enumMap, LOWER_CASE_FUNCTION);
    }

    public static <T extends Enum<T>> T fromStringIgnoreWhitespace(String value, Map<String, T> enumMap) {
        return fromString(value, enumMap, LOWER_CASE_WITHOUT_WHITE_SPACES_FUNCTION);
    }

    public static <T extends Enum<T>> T fromStringIgnoreWhitespace(String value, Map<String, T> enumMap, T
            defaultValue) {
        T result = fromString(value, enumMap, LOWER_CASE_WITHOUT_WHITE_SPACES_FUNCTION);
        if (nonNull(result)) {
            return result;
        }
        if (nonNull(value)) {
            return defaultValue;
        }
        return null;
    }

    public static <T extends Enum<T>> T fromStringToLowerCase(String value, Map<String, T> enumMap, T
            defaultValue) {
        T result = fromString(value, enumMap, LOWER_CASE_FUNCTION);
        if (nonNull(result)) {
            return result;
        }
        if (nonNull(value)) {
            return defaultValue;
        }
        return null;
    }

    public static <T extends Enum<T>> T fromStringToLowerCaseWithDefault(String value, Map<String, T> enumMap, T
            defaultValue) {
        T result = fromString(value, enumMap, LOWER_CASE_FUNCTION);
        if (nonNull(result)) {
            return result;
        }
        return defaultValue;

    }


    public static <T extends Enum<T>, V> T fromType(V value, Map<V, T> enumMap, T defaultValue) {
        T result = enumMap.get(value);
        if (nonNull(result)) {
            return result;
        }
        return defaultValue;
    }
}
