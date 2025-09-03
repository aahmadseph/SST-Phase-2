package com.sephora.services.sourcingoptions.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ZipCodeValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidZipCode {
    String message() default "The field '{toZipCode}' must be >= than the field '{fromZipCode}'";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
    
}
