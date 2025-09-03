package com.sephora.services.inventoryavailability.model.invusers;

import java.util.List;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ApiModel(value = "InvUsers")
@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString
@NoArgsConstructor
public class InvUsersListResponse {
	private String applicationId;
	private List<String> users;
}
