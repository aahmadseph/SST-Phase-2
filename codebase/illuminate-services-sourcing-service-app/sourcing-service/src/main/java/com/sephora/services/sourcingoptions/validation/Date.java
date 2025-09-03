package com.sephora.services.sourcingoptions.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static com.sephora.platform.common.utils.DateTimeUtils.DATE_FORMAT;

@Documented
@Constraint(validatedBy = DateParameterValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Date {
    String message() default "The date field has incorrect format. Expected format: '" + DATE_FORMAT + "'";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String format() default DATE_FORMAT;
}
