package com.sephora.services.confighub.utils;

import javax.validation.ConstraintViolation;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.ObjectError;

/**
 * It is a copy-pasted version of {@link com.sephora.platform.common.utils.MessageUtils}
 * with simple change to get default locale from {@link LocaleContextHolder#getLocale()}
 * instead of {@link java.util.Locale#getDefault()}
 */
@Log4j2
public final class ConfigurationMessageUtils {

    private static final String NOT_SPECIFIED_ERROR_CODE = "ERR_S_00000";
    private static final String UNABLE_TO_FIND_ERROR = "Unable to find message={}";

    public static String getMessage(MessageSource source, String messageCode, Object... args) {
        String message = "";

        try {
            message = source.getMessage(removeCurlyBraces(messageCode), args, LocaleContextHolder.getLocale());
        } catch (NoSuchMessageException ex) {
            log.warn(UNABLE_TO_FIND_ERROR, messageCode);
        }

        return message;
    }

    public static String getMessage(MessageSource source, MessageSourceResolvable resolvable, boolean skipDefaultMessage) {
        String message = "";

        try {
            message = source.getMessage(resolvable, LocaleContextHolder.getLocale());

            if (skipDefaultMessage && message.equals(resolvable.getDefaultMessage())) {
                message = "";
            }
        } catch (NoSuchMessageException ex) {
            log.warn(UNABLE_TO_FIND_ERROR, resolvable.getCodes());
        }

        return message;
    }

    public static String getMessage(MessageSource source, MessageSourceResolvable resolvable) {
        return getMessage(source, resolvable, false);
    }

    public static String getMessage(MessageSource source, ConstraintViolation constraintViolation, boolean skipDefaultMessage) {
        String message = getMessage(source, constraintViolation.getMessageTemplate());

        if (!skipDefaultMessage && StringUtils.isBlank(message)) {
            message = constraintViolation.getMessage();
        }

        return message;
    }

    public static String getMessage(MessageSource source, ConstraintViolation constraintViolation) {
        return getMessage(source, constraintViolation, false);
    }

    public static String getErrorCode(MessageSource source, String errorCode) {
        return StringUtils.defaultIfBlank(getMessage(source, errorCode), NOT_SPECIFIED_ERROR_CODE);
    }

    public static String getErrorCode(MessageSource source, ConstraintViolation constraintViolation) {
        return StringUtils.defaultIfBlank(getMessage(source, constraintViolation, true), NOT_SPECIFIED_ERROR_CODE);
    }

    public static String getErrorCode(MessageSource source, ObjectError objectError) {
        return StringUtils.defaultIfBlank(getMessage(source, objectError, true), NOT_SPECIFIED_ERROR_CODE);
    }

    private static String removeCurlyBraces(String messageTemplate) {
        if (messageTemplate.startsWith("{")) {
            return messageTemplate.substring(1, messageTemplate.length() - 1);
        }

        return messageTemplate;
    }
}