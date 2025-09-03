package com.sephora.services.inventory.validation;



import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import com.sephora.platform.common.validation.exception.ValidationException;

/**
 * @author Vitaliy Oleksiyenko
 */
public class ValidationUtils {

    private static final String TRUE = "true";
    private static final String FALSE = "false";

    private static final String DATE_FORMAT_STR = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
    public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(DATE_FORMAT_STR);
    public static final String INVALID_FORMAT_PREFIX = "InvalidFormat.";

    /**
     * Strict conversion from string to boolean
     * <p>
     * Default jackson deserializer convert number to boolean without errors
     *
     * @param value                value to convert
     * @param property property
     * @return boolean value
     * @throws ValidationException thrown if validation fail
     */
    public static Boolean toBoolean(String value, String property) {
        if (TRUE.equalsIgnoreCase(value)) {
            return Boolean.TRUE;
        } else if (FALSE.equalsIgnoreCase(value)) {
            return Boolean.FALSE;
        }

        throw new ValidationException(getIncorrectFormatMessageKey(property));
    }

    public static ZonedDateTime toLocalDateTime(String value, String property) {

        if (value != null) {
            try {
                return ZonedDateTime.parse(value, DATE_TIME_FORMATTER);
            } catch (RuntimeException exc) {
                throw new ValidationException(getIncorrectFormatMessageKey(property));
            }
        }
        return null;
    }

    private static String getIncorrectFormatMessageKey(String property){
         return INVALID_FORMAT_PREFIX + property;
    }
}
