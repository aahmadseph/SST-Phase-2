package com.sephora.services.sourcingoptions.model.cosmos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ZipCodeDetails {
	private String fromZipCode;
    private String toZipCode;
    private List<String> priority;
    private String createdAt;
    private String state;
}
