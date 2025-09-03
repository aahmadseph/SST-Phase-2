package com.sephora.services.inventoryavailability.model.fiegn;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ExceptionContent {
	private String path;
	private String error;
	private String message;
	private String status;
	private String timestamp;
}
