package com.sephora.services.sourcingoptions.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class AzureTableQueryResponse {

    private List<AzureTableEntityResponse> value;
}
