package com.sephora.services.sourcingoptions.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = OmsPromiseDateValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface OmsLineIdValid {
    String message() default "lineId property is mandatory for OMS requests";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
