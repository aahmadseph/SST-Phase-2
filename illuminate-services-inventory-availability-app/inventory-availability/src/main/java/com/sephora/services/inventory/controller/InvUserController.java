package com.sephora.services.inventory.controller;

import org.springframework.http.ResponseEntity;

import com.sephora.services.inventoryavailability.model.invusers.RoleDetails;
import com.sephora.services.inventoryavailability.model.invusers.add.InvUsersRequest;

public interface InvUserController {
	 ResponseEntity<Object> getUsersList(); 
	 ResponseEntity<Object> saveUser(InvUsersRequest invUsersRequest);
	 ResponseEntity<Object> updateUser(InvUsersRequest invUsersRequest);
	 ResponseEntity<Object> deleteUser(String userId);
	 ResponseEntity<Object> getUser(String userId);
	 
	 public ResponseEntity<Object> getRoles();
	 public ResponseEntity<Object> createRole(RoleDetails roleDetails);
	 public ResponseEntity<Object> deleteRole(String roleId);
}
