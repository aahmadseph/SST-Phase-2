package com.sephora.services.confighub.configuration.handler;

import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.status;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.sephora.platform.common.validation.RawErrorMessage;
import com.sephora.platform.common.validation.exception.ValidationException;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.confighub.utils.ConfigurationMessageUtils;
import com.sephora.services.confighub.validation.dto.ErrorDto;
import com.sephora.services.confighub.validation.dto.ErrorListDto;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import javax.validation.ConstraintViolation;
import javax.validation.metadata.ConstraintDescriptor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.hibernate.validator.internal.engine.path.NodeImpl;
import org.hibernate.validator.internal.engine.path.PathImpl;
import org.slf4j.MDC;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Use this class only to override {@link ResponseEntityExceptionHandler} methods
 * Add new custom exceptions handlers to {@link ConfigurationExceptionHandler}
 *
 * @author Vitaliy Oleksiyenko
 */
@Slf4j
public abstract class ConfigurationResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    private static final String INTERNAL_SERVER_ERROR = "internal.server.error";
    private static final String INVALID_FORMAT_ERROR = "invalid.format";
    private static final String UNKNOWN_VALIDATION_ERROR = "unknown.validation.error";

    public abstract MessageSource getMessageSource();

    public abstract MessageSource getErrorCodesMessageSource();

    public abstract RequestLoggingFilterConfig getRequestLoggingFilterConfig();

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, @Nullable Object body, HttpHeaders headers,
        HttpStatus status, WebRequest request) {
        if (ex instanceof HttpMessageNotReadableException) {
            return handleHttpMessageNotReadable((HttpMessageNotReadableException) ex, body, headers, status, request);
        } else {
            log.error("Internal exception thrown ", ex);

            return status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createInternalServerError());
        }
    }

    private ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, Object body,
        HttpHeaders headers, HttpStatus status, WebRequest request) {
        log.error("Input payload not readable ", ex);

        if (ex.getCause() instanceof JsonMappingException) {
            return handleJsonMappingException((JsonMappingException) ex.getCause());
        } else if (ex.getCause() instanceof JsonParseException) {
            log.error("Unable to parse input JSON", ex);
        }

        return badRequest().body(createInvalidFormatError());
    }

    private ResponseEntity<Object> handleJsonMappingException(JsonMappingException ex) {
        if (ex.getCause() instanceof ValidationException) {
            return handleValidationException((ValidationException) ex.getCause());
        }

        return badRequest().body(createInvalidFormatError());
    }

    private ResponseEntity<Object> handleValidationException(ValidationException e) {
        return badRequest().body(createSingleError(e.getField(), e.getMessage(), e.getArgs()));
    }

    @Override
    @NonNull
    protected ResponseEntity<Object> handleMethodArgumentNotValid(@NonNull MethodArgumentNotValidException ex,
        @NonNull HttpHeaders headers,
        @NonNull HttpStatus status,
        @NonNull WebRequest request) {
        return handleBindingException(ex.getBindingResult());
    }

    @Override
    @NonNull
    protected ResponseEntity<Object> handleBindException(@NonNull BindException ex,
        @NonNull HttpHeaders headers,
        @NonNull HttpStatus status,
        @NonNull WebRequest request) {
        return handleBindingException(ex.getBindingResult());
    }

    private ResponseEntity<Object> handleBindingException(BindingResult bindingResult) {
        ErrorListDto result;

        if (bindingResult != null && bindingResult.hasErrors()) {
            ErrorListDto.ErrorListDtoBuilder builder = ErrorListDto.builder();
            builder.correlationId(getCorrelationId());

            List<FieldError> fieldErrors = bindingResult.getFieldErrors();
            if (CollectionUtils.isNotEmpty(fieldErrors)) {
                fieldErrors.forEach(error -> builder.addError(createError(error)));
            }

            List<ObjectError> globalErrors = bindingResult.getGlobalErrors();
            if (CollectionUtils.isNotEmpty(globalErrors)) {
                globalErrors.forEach(error -> builder.addError(createError(error)));
            }

            result = builder.build();
        } else {
            result = createUnknownValidationError();
        }

        return badRequest().body(result);
    }

    protected ErrorListDto createInvalidFormatError() {
        return createSingleError(INVALID_FORMAT_ERROR);
    }

    protected ErrorListDto createUnknownValidationError() {
        return createSingleError(UNKNOWN_VALIDATION_ERROR);
    }

    protected ErrorListDto createInternalServerError() {
        return createSingleError(INTERNAL_SERVER_ERROR);
    }

    protected ErrorListDto createSingleError(String message, Object... args) {
        return ErrorListDto.builder()
            .correlationId(getCorrelationId())
            .addError(createError(message, args))
            .build();
    }

    protected ErrorListDto createSingleError(String field, String message, Object... args) {
        return ErrorListDto.builder()
            .correlationId(getCorrelationId())
            .addError(createError(field, message, args))
            .build();
    }

    protected ErrorDto createError(String field, String message, Object... args) {
        return ErrorDto.builder()
            .field(field)
            .code(ConfigurationMessageUtils.getErrorCode(getErrorCodesMessageSource(), message))
            .error(ConfigurationMessageUtils.getMessage(getMessageSource(), message, args))
            .build();
    }

    protected ErrorDto createError(String message, Object... args) {
        return ErrorDto.builder()
            .code(ConfigurationMessageUtils.getErrorCode(getErrorCodesMessageSource(), message))
            .error(ConfigurationMessageUtils.getMessage(getMessageSource(), message, args))
            .build();
    }

    protected ErrorDto createError(ConstraintViolation<?> error) {
        return ErrorDto.builder()
            .field(getFieldName(error))
            .code(ConfigurationMessageUtils.getErrorCode(getErrorCodesMessageSource(), error))
            .error(ConfigurationMessageUtils.getMessage(getMessageSource(), error))
            .build();
    }

    protected ErrorDto createError(FieldError error) {
        if (isRawErrorMessageProcessing(error)) {
            return createError(error.getDefaultMessage());
        }

        return ErrorDto.builder()
            .field(error.getField())
            .code(ConfigurationMessageUtils.getErrorCode(getErrorCodesMessageSource(), error))
            .error(ConfigurationMessageUtils.getMessage(getMessageSource(), error))
            .build();
    }

    protected ErrorDto createError(ObjectError error) {
        if (isRawErrorMessageProcessing(error)) {
            return createError(error.getDefaultMessage());
        }

        return ErrorDto.builder()
            .code(ConfigurationMessageUtils.getErrorCode(getErrorCodesMessageSource(), error))
            .error(ConfigurationMessageUtils.getMessage(getMessageSource(), error))
            .build();
    }

    protected String getFieldName(ConstraintViolation<?> error) {
        return Optional.ofNullable((PathImpl) error.getPropertyPath())
            .map(PathImpl::getLeafNode)
            .map(NodeImpl::getName)
            .orElse(null);
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    protected boolean isRawErrorMessageProcessing(ObjectError error) {
        if (error.contains(ConstraintViolation.class)) {
            try {
                return Optional.of(error.unwrap(ConstraintViolation.class))
                    .map(ConstraintViolation::getConstraintDescriptor)
                    .map(ConstraintDescriptor::getConstraintValidatorClasses)
                    .map(Collection<Class>::stream)
                    .orElse(Stream.empty())
                    .findFirst()
                    .map(cls -> cls.isAnnotationPresent(RawErrorMessage.class))
                    .orElse(false);
            } catch (IllegalArgumentException e) {
                log.error("Unable to cast ObjectError source to ConstraintViolation", e);
            }
        }
        return false;
    }

    protected String getCorrelationId() {
        return MDC.get(getRequestLoggingFilterConfig().getCorrelationIdMDCKeyName());
    }
}
