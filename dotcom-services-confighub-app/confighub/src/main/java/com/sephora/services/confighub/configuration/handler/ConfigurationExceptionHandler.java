package com.sephora.services.confighub.configuration.handler;

import javax.validation.ConstraintViolationException;
import javax.validation.UnexpectedTypeException;

import com.sephora.services.confighub.dto.ErrorResponseDto;
import com.sephora.services.confighub.exception.DataNotFoundException;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.sephora.platform.common.exception.AlreadyExistsException;
import com.sephora.platform.common.exception.NotFoundException;
import com.sephora.platform.common.validation.exception.ValidationException;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.confighub.exception.ConfigurationServiceException;
import com.sephora.services.confighub.validation.dto.ErrorListDto;

import lombok.extern.slf4j.Slf4j;

import static com.sephora.services.confighub.config.MessageConfig.ERROR_CODES_MESSAGE_SOURCE;
import static com.sephora.services.confighub.config.MessageConfig.MESSAGE_SOURCE;
import static org.springframework.http.HttpStatus.*;

/**
 * Please add any code related to {@link ResponseEntityExceptionHandler}
 * customization into the ancestor class {@link ConfigurationResponseEntityExceptionHandler}
 */
@Slf4j
@RestControllerAdvice("com.sephora.services.confighub.controller")
public class ConfigurationExceptionHandler extends ConfigurationResponseEntityExceptionHandler {

    private static final String PARAMETER_TYPE_MISMATCH_ERROR = "parameter.type.mismatch";
    private static final String UNEXPECTED_TYPE_ERROR = "unexpected.type.error";

    @Autowired
    @Qualifier(MESSAGE_SOURCE)
    private MessageSource messageSource;

    @Autowired
    @Qualifier(ERROR_CODES_MESSAGE_SOURCE)
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

    @Override
    public RequestLoggingFilterConfig getRequestLoggingFilterConfig() {
        return requestLoggingFilterConfig;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(INTERNAL_SERVER_ERROR)
    public ErrorListDto handleError(Exception e) {
        log.error("Unexpected exception occurred: {}", e.getMessage(), e);
        return createInternalServerError();
    }

    @ExceptionHandler(ConfigurationServiceException.class)
    @ResponseStatus(INTERNAL_SERVER_ERROR)
    public ErrorListDto handleSubscriptionExceptionHandler(ConfigurationServiceException e) {
        log.error("ConfigurationExceptionHandler occurred: {}", e.getMessage(), e);
        return createInternalServerError();
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(BAD_REQUEST)
    public ErrorListDto handleConstraintViolationException(ConstraintViolationException ex) {
        ErrorListDto.ErrorListDtoBuilder errorListBuilder = ErrorListDto.builder();
        errorListBuilder.correlationId(getCorrelationId());

        if (CollectionUtils.isNotEmpty(ex.getConstraintViolations())) {
            ex.getConstraintViolations().forEach(constraintViolation ->
                errorListBuilder.addError(createError(constraintViolation)));
        }

        return errorListBuilder.build();
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(BAD_REQUEST)
    protected ErrorListDto handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        log.error("MethodArgumentTypeMismatchException occurred: {}", e.getMessage(), e);
        return createSingleError(PARAMETER_TYPE_MISMATCH_ERROR, (Object) e.getName());
    }

    @ExceptionHandler(UnexpectedTypeException.class)
    @ResponseStatus(BAD_REQUEST)
    protected ErrorListDto handleUnexpectedTypeException(UnexpectedTypeException e) {
        log.error("UnexpectedTypeException occurred: {}", e.getMessage(), e);
        return createSingleError(UNEXPECTED_TYPE_ERROR);
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(BAD_REQUEST)
    public ErrorListDto handleValidationException(ValidationException e) {
        log.error("ValidationException occurred: {}", e.getMessage(), e);
        return createSingleError(e.getField(), e.getMessage(), e.getArgs());
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(NOT_FOUND)
    public ErrorListDto handleNotFoundException(NotFoundException e) {
        return createSingleError(e.getMessage(), e.getArgs());
    }

    @ExceptionHandler(AlreadyExistsException.class)
    @ResponseStatus(BAD_REQUEST)
    public ErrorListDto handleAlreadyExistsException(AlreadyExistsException e) {
        return createSingleError(e.getMessage(), e.getArgs());
    }

    @ExceptionHandler(DataNotFoundException.class)
    @ResponseStatus(NOT_FOUND)
    protected ErrorListDto handleDataNotFoundExceptions(Exception e) {
        return createSingleError(e.getMessage(), e.getMessage());
    }

    @ExceptionHandler(HttpClientErrorException.BadRequest.class)
    @ResponseStatus(BAD_REQUEST)
    protected ErrorListDto handleCustomParameterConstraintExceptions(Exception e) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        return createSingleError(e.getMessage(), e.getMessage());
    }

}
