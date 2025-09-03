package com.sephora.services.inventoryavailability.model.invusers.add;

import java.util.List;

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
public class InvUsersRequest {
	private String userId;
	private List<String> roles;
}
