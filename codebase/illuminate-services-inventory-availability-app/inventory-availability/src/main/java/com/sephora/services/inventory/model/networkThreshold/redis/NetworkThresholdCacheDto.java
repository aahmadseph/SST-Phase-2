package com.sephora.services.inventory.model.networkThreshold.redis;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NetworkThresholdCacheDto implements Serializable {
	private String productId;
	private String sellingChannel;
	private Double atp;
	private String atpStatus;
	private String updateTime;
}
