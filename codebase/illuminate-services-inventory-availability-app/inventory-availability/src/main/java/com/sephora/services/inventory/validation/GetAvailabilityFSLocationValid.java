package com.sephora.services.inventory.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;


@Documented
@Constraint(validatedBy = GetAvailabilityFSLocationValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface GetAvailabilityFSLocationValid {
	String message() default "locations cannot be null or empty if FulfillmentType not equal to SHIP";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
}
