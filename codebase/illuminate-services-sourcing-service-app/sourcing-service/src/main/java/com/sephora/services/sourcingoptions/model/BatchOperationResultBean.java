package com.sephora.services.sourcingoptions.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchOperationResultBean {

    private Integer recordCount;

    private Integer processedRecordCount;

    private Integer failedRecordCount;

}
