package com.sephora.services.sourcingoptions.model.cosmos;

import com.sephora.platform.common.validation.Enum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;

import java.io.Serializable;
import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.Map;

@Builder
@FieldNameConstants
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Calendar implements Serializable {

    private String calendarName;

    private Map<@Enum(enumClass = DayOfWeek.class) String,
                       String> schedule = new HashMap<>();
}
