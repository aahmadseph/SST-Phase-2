package com.sephora.services.sourcingoptions.controller;

import com.sephora.platform.common.exception.handler.BaseResponseEntityExceptionHandler;
import com.sephora.platform.common.model.ErrorList;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.sourcingoptions.exception.AHBadRequestException;
import com.sephora.services.sourcingoptions.exception.AHPromiseDateException;
import com.sephora.services.sourcingoptions.exception.NotFoundException;
import com.sephora.services.sourcingoptions.exception.SourcingItemsServiceException;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.exception.ZoneMapCsvValidationException;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Optional;

import static com.sephora.services.sourcingoptions.config.MessageConfig.SOURCING_ERROR_CODES_MESSAGE_SOURCE;
import static com.sephora.services.sourcingoptions.config.MessageConfig.SOURCING_MESSAGE_SOURCE;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;

/**
 * Handle exception on Sourcing application
 */
@ControllerAdvice("com.sephora.services.sourcingoptions.controller")
public class SourcingResponseEntityExceptionHandler extends BaseResponseEntityExceptionHandler {

    private static final String SOURCING_SERVER_ERROR = "sourcing.service.error";

    @Autowired
    @Qualifier(SOURCING_MESSAGE_SOURCE)
    private MessageSource messageSource;

    @Autowired
    @Qualifier(SOURCING_ERROR_CODES_MESSAGE_SOURCE)
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

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(NOT_FOUND)
    @ResponseBody
    public ErrorList handleNotFoundException(NotFoundException ex) {
        return getErrorListBuilder()
                .withError(createError(ex.getMessage(), ex.getArgs()))
                .build();
    }

    @ExceptionHandler(SourcingServiceException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorList handleInventoryServiceException(SourcingServiceException ex) {
        return createInternalServerError();
    }

    @ExceptionHandler(SourcingItemsServiceException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    @ResponseBody
    public ErrorList handleSourcingItemsServiceException(SourcingItemsServiceException ex) {
        return getErrorListBuilder()
                .withError(this.createError(SOURCING_SERVER_ERROR,
                        MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()),
                        Optional.ofNullable(ex.getCause()).map(Throwable::toString).orElse("N/A")))
                .build();
    }
    
    @ExceptionHandler(ZoneMapCsvValidationException.class)
    @ResponseStatus(NOT_ACCEPTABLE)
    @ResponseBody
    public ErrorList handleZoneMapCsvValidationException(ZoneMapCsvValidationException ex) {
        return getErrorListBuilder()
                .withError(createError(ex.getMessage(), ex.getArgs()))
                .build();
    }
    
    @ExceptionHandler(AHPromiseDateException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorList handleAHPromiseDateException(AHPromiseDateException ex) {
        return getErrorListBuilder()
                .withError(createError(ex.getMessage(), ex.getArgs()))
                .build();
    }
    
    @ExceptionHandler(AHBadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorList handleAHBadRequestException(AHBadRequestException ex) {
        return getErrorListBuilder()
                .withError(createError(ex.getMessage(), ex.getArgs()))
                .build();
    }
}