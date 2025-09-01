package com.sephora.services.common.inventory.exception;

import lombok.Getter;

import javax.validation.ConstraintViolation;
import java.util.Set;

@Getter
public class SepValidationException extends Exception{
    @Getter
    private Set<ConstraintViolation<Object>> violations;

    public SepValidationException(Set<ConstraintViolation<Object>> violations){
        this.violations = violations;
    }
}
