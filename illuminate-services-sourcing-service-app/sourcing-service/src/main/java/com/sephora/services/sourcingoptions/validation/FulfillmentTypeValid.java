package com.sephora.services.sourcingoptions.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = FulfillmentTypeValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface FulfillmentTypeValid {
    String message() default "Invalid fulfillmentType field";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
