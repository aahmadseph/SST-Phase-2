package com.sephora.services.deliveryoptions.model.cache;


import com.sephora.platform.common.validation.Enum;
import com.sephora.services.deliveryoptions.model.EnterpriseCodeEnum;
import com.sephora.services.deliveryoptions.model.LevelOfServiceEnum;
import com.sephora.services.deliveryoptions.model.doc.Calendar;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;

import java.io.Serializable;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldNameConstants
public class CarrierServiceCache implements Serializable {

    private String carrierServiceCode;

    @Enum(enumClass = LevelOfServiceEnum.class)
    private String levelOfService;

    @Enum(enumClass = EnterpriseCodeEnum.class)
    private String enterpriseCode;

    private Boolean isHazmat;

    private Calendar pickupCalendar;

    private Calendar deliveryCalendar;

    private Integer transitDays;

    private Integer additionalTransitDays;

    private Integer deliveryDateType;
    
    private String updateTime;

}
