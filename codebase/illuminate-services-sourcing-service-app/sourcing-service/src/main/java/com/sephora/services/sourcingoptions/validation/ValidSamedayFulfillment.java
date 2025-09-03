package com.sephora.services.sourcingoptions.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = SamedayFulfillmentValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidSamedayFulfillment {
    String message() default "locationIds are mandatory for SAMEDAY fulfillmentType";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
