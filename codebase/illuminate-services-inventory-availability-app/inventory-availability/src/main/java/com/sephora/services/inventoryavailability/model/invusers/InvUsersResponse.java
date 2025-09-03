package com.sephora.services.inventoryavailability.model.invusers;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InvUsersResponse {
	private String userId;
	private List<RoleDetails> roles;
}
