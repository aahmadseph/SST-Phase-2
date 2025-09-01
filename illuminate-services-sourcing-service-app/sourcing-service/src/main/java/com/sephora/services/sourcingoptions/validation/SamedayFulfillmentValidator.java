package com.sephora.services.sourcingoptions.validation;


import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import org.springframework.util.CollectionUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class SamedayFulfillmentValidator implements ConstraintValidator<ValidSamedayFulfillment, SourcingOptionsRequestDto> {
    @Override
    public void initialize(ValidSamedayFulfillment constraintAnnotation) {

    }

    @Override
    public boolean isValid(SourcingOptionsRequestDto value, ConstraintValidatorContext context) {
        if(value == null || value.getItems() == null){
            //not testing whether items exists or not as it is already handled in other validations.
            return true;
        }
        return !value.getItems()
                .stream()
                .anyMatch(itemDto ->{
                            if(itemDto.getFulfillmentType() != null){
                                return itemDto.getFulfillmentType().equals(FulfillmentTypeEnum.SAMEDAY.toString()) && CollectionUtils.isEmpty(itemDto.getLocationIds());
                            }else if(value.getFulfillmentType().equals(FulfillmentTypeEnum.SAMEDAY.toString())){
                                return CollectionUtils.isEmpty(itemDto.getLocationIds());
                            }else {
                                return false;
                            }
                        });
    }
}
