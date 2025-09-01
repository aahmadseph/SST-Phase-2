package com.sephora.services.inventoryavailability.model.invusers;

import java.util.List;

import com.sephora.services.inventoryavailability.model.invusers.InvUsersListResponse.InvUsersListResponseBuilder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString
@NoArgsConstructor
public class RoleDetails {
	private String id;
	private String roleName;
	private List<String> privileges;
}
