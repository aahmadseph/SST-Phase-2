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

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

/**
 * @author Vitaliy Oleksiyenko
 */
@Documented
@Constraint(validatedBy = CountryValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface CountryValid {
    String message() default "Country should be non-empty if SellerCode is BORDERFREE otherwise it is US/CA or empty";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
