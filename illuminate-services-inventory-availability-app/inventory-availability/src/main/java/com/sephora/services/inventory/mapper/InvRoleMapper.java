package com.sephora.services.inventory.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.sephora.services.inventory.model.cosmos.doc.InvRoles;
import com.sephora.services.inventoryavailability.model.invusers.RoleDetails;

@Mapper
public interface InvRoleMapper {
	
	@Mapping(source = "id", target = "id")
	@Mapping(source = "roleName", target = "roleName")
	@Mapping(source = "privileges", target = "privileges")
	public RoleDetails convert(InvRoles invRoles);
}
