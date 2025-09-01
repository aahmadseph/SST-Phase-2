
package com.sephora.services.inventory.model.networkThreshold.redis;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AtpByFulfillmentType implements Serializable {
    public String fulfillmentType;
    public Double atp;
    public String atpStatus;
}
