package com.sephora.services.sourcingoptions.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ShipNodePriorityValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidShipNodesPriority {
    String message() default "The field-s '{nodePriority}' length must be less than or equal to 40 symbols";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
