package com.sephora.services.inventory.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.sephora.services.inventoryavailability.model.cosmos.doc.users.InvUsers;
import com.sephora.services.inventoryavailability.model.invusers.add.InvUsersRequest;


@Mapper
public interface SaveInvUserMapper {
	@Mapping(source = "userId", target = "id")
	@Mapping(source = "userId", target = "userId")
	@Mapping(source = "roles", target = "roles")
	public InvUsers convert(InvUsersRequest invUsersRequest);
}
