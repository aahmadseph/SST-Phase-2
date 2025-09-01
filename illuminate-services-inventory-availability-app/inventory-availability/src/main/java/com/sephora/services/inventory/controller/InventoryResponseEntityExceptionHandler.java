package com.sephora.services.inventory.controller;

import static com.sephora.services.inventoryavailability.InventoryAvailabilityApplication.INVENTORY_ERROR_CODES_MESSAGE_SOURCE;
import static com.sephora.services.inventoryavailability.InventoryAvailabilityApplication.INVENTORY_MESSAGE_SOURCE;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import java.util.Locale;
import java.util.Optional;
import java.util.concurrent.CompletionException;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.sephora.platform.common.exception.handler.BaseResponseEntityExceptionHandler;
import com.sephora.platform.common.model.ErrorList;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.inventory.exception.NotFoundException;
import com.sephora.services.inventory.service.InventoryServiceException;
import com.sephora.services.inventory.validation.exception.InventoryValidationException;


/**
 * Handle exception on application
 *
 * @author Vitaliy Oleksiyenko
 */
@ControllerAdvice("com.sephora.services.inventory.controller")
public class InventoryResponseEntityExceptionHandler extends BaseResponseEntityExceptionHandler {

    private static final String INVENTORY_SERVICE_ERROR = "inventory.server.error";

    private static final Locale DEFAULT_LOCALE = Locale.US;

    @Autowired
    @Qualifier(INVENTORY_MESSAGE_SOURCE)
    private MessageSource messageSource;

    @Autowired
    @Qualifier(INVENTORY_ERROR_CODES_MESSAGE_SOURCE)
    private MessageSource errorCodesMessageSource;

    @Autowired
    private RequestLoggingFilterConfig requestLoggingFilterConfig;

    @Override
    public MessageSource getMessageSource() {
        return messageSource;
    }

    @Override
    public MessageSource getErrorCodesMessageSource() {
        return errorCodesMessageSource;
    }

    protected ResponseEntity<Object> handleJsonMapping(JsonMappingException ex) {
        if (ex.getCause() instanceof InventoryValidationException) {
            return handleInventoryValidation((InventoryValidationException) ex.getCause());
        }
        return super.handleJsonMapping(ex);
    }

    private ResponseEntity<Object> handleInventoryValidation(InventoryValidationException ex) {
        String message = messageSource.getMessage(ex.getErrorCode(), ex.getArgs(), DEFAULT_LOCALE);
        return new ResponseEntity<>(getErrorListBuilder().withErrorMessage(message).build(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(NOT_FOUND)
    @ResponseBody
    public ErrorList handleNotFoundException(NotFoundException ex) {
        return getErrorListBuilder()
                .withError(createError(ex.getMessage(), ex.getArgs()))
                .build();
    }

    @ExceptionHandler(InventoryServiceException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorList handleInventoryServiceException(InventoryServiceException ex) {
        return getErrorListBuilder()
                .withError(this.createError(INVENTORY_SERVICE_ERROR,
                        MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()),
                        Optional.ofNullable(ex.getCause()).map(Throwable::toString).orElse("N/A")))
                .build();

    }

    @ExceptionHandler(CompletionException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorList handleCompletionException(CompletionException ex) {
        return getErrorListBuilder()
                .withError(this.createError(INVENTORY_SERVICE_ERROR,
                        MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()),
                        Optional.ofNullable(ex.getCause()).map(Throwable::toString).orElse("N/A")))
                .build();

    }

}