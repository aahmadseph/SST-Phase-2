package com.sephora.services.sourcingoptions.validation;

import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import static com.sephora.services.sourcingoptions.validation.ValidationConstants.NODE_PRIORITY_PIPE_PATTERN;
import static com.sephora.services.sourcingoptions.validation.ValidationConstants.NODE_PRIORITY_ZIP_CODE_MAX_LENGTH;

public class ShipNodePriorityValidator implements ConstraintValidator<ValidShipNodesPriority, String> {

    @Override
    public void initialize(ValidShipNodesPriority notEmptyFields) {
    }

    @Override
    public boolean isValid(String nodePriority, ConstraintValidatorContext constraintValidatorContext) {
        if (StringUtils.isEmpty(nodePriority)) {
            return true;
        }
        return NODE_PRIORITY_PIPE_PATTERN.splitAsStream(nodePriority).allMatch(n -> n.length() <= NODE_PRIORITY_ZIP_CODE_MAX_LENGTH);
    }

}