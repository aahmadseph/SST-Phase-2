/*
 *  This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 *  consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 *  Copyright  2019 sephora.com, Inc. All rights reserved.
 *
 */

package com.sephora.services.sourcingoptions.validation;

import com.sephora.services.sourcingoptions.model.CountryEnum;
import com.sephora.services.sourcingoptions.model.SellerCodeEnum;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class CountryValidator implements ConstraintValidator<CountryValid, SourcingOptionsRequestDto> {

    @Override
    public void initialize(CountryValid constraintAnnotation) {

    }
    /**
     * Country id non-empty if SellerCode is BORDERFREE otherwise it is US/CA or empty
     */
    @Override
    public boolean isValid(SourcingOptionsRequestDto sourcingOptionsRequestDto, ConstraintValidatorContext constraintValidatorContext) {
        if(sourcingOptionsRequestDto.getShippingAddress() == null){
            //missing shipping address is handled in different validator
            return true;
        }
        if (sourcingOptionsRequestDto.getSellerCode() != null && sourcingOptionsRequestDto.getShippingAddress() != null &&
                !SellerCodeEnum.BORDERFREE.name().equalsIgnoreCase(sourcingOptionsRequestDto.getSellerCode())) {
            return !isCountryNotValid(sourcingOptionsRequestDto.getShippingAddress().getCountry());
        } else {
        	return !isCountryNotEmpty(sourcingOptionsRequestDto.getShippingAddress().getCountry());
        }
        //country should not be empty for any request.
        //return !isCountryNotEmpty(sourcingOptionsRequestDto.getShippingAddress().getCountry());
    }

    private boolean isCountryNotEmpty(String  country){
        if(StringUtils.isEmpty(country)){
            return true;
        }
        return false;
    }

    private boolean isCountryNotValid(String country) {
        if(StringUtils.isEmpty(country)){
            return false;
        }
        try {
            Enum.valueOf(CountryEnum.class, country);
            return false;
        } catch (IllegalArgumentException e) {
            return true;
        }
    }
}
