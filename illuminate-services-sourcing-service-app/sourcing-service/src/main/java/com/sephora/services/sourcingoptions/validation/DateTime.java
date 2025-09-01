package com.sephora.services.sourcingoptions.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

import static com.sephora.platform.common.utils.DateTimeUtils.DATE_TIME_FORMAT;

@Documented
@Constraint(validatedBy = DateTimeParameterValidator.class)
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface DateTime {
    String message() default "The date field has incorrect format. Expected format: '" + DATE_TIME_FORMAT + "'";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String format() default DATE_TIME_FORMAT;
}
