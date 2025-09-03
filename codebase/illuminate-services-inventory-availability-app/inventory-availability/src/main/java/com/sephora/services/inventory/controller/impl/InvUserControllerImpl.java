package com.sephora.services.inventory.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.services.inventory.controller.InvUserController;
import com.sephora.services.inventory.service.InvRolesService;
import com.sephora.services.inventory.service.InvUserService;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.invusers.RoleDetails;
import com.sephora.services.inventoryavailability.model.invusers.add.InvUsersRequest;

import lombok.extern.log4j.Log4j2;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@RestController
@RequestMapping("/")
@ControllerDocumentation
@Log4j2
@EnableSwagger2
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public class InvUserControllerImpl implements InvUserController {

	@Autowired
	InvUserService invUserService;
	
	@Autowired
	InvRolesService invRolesService;
	
	@Override
	@GetMapping("/InvUsers")
	public ResponseEntity<Object> getUsersList() {
		try {
			log.info("getUsersList request recieved.");
			return ResponseEntity.ok(invUserService.getUsers());
		} catch (AvailabilityServiceException inventoryServiceException) {
			log.error("Exception occured while getting user list. Status: {}",
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()).toString());
			return new ResponseEntity<>(inventoryServiceException.getErrorDetails(),
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()));
		}
	}

	@Override
	@PostMapping("/InvUser")
	public ResponseEntity<Object> saveUser(@RequestBody InvUsersRequest invUsersRequest) {
		try {
			log.info("createUser request recieved: {}", invUsersRequest);
			invUserService.saveUser(invUsersRequest);
			return ResponseEntity.ok().build();
		} catch (AvailabilityServiceException inventoryServiceException) {
			log.error("Exception occured while saving invUser. Status: {}",
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()).toString());
			return new ResponseEntity<>(inventoryServiceException.getErrorDetails(),
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()));
		}
	}
	
	@Override
	@PutMapping("/InvUser")
	public ResponseEntity<Object> updateUser(@RequestBody InvUsersRequest invUsersRequest) {
		try {
			log.info("updateUser request recieved: {}", invUsersRequest);
			invUserService.updateUser(invUsersRequest);
			return ResponseEntity.ok().build();
		} catch (AvailabilityServiceException inventoryServiceException) {
			log.error("Exception occured while updating invUser. Status: {}",
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()).toString());
			return new ResponseEntity<>(inventoryServiceException.getErrorDetails(),
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()));
		}
	}

	@Override
	@DeleteMapping("/InvUser/{userId}")
	public ResponseEntity<Object> deleteUser(@PathVariable String userId) {
		try {
			log.info("deleteUser request recieved, userId: {}", userId);
			invUserService.deleteUser(userId);
			return ResponseEntity.ok().build();
		} catch (AvailabilityServiceException inventoryServiceException) {
			log.error("Exception occured while deleting invUser. Status: {}",
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()).toString());
			return new ResponseEntity<>(inventoryServiceException.getErrorDetails(),
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()));
		}
	}

	@Override
	@GetMapping("/InvUser/{userId}")
	public ResponseEntity<Object> getUser(@PathVariable String userId) {
		try {
			log.info("getUser request recieved, userId: {}", userId);
			return ResponseEntity.ok(invUserService.getUserDetails(userId));
		} catch (AvailabilityServiceException inventoryServiceException) {
			log.error("Exception occured while fetching invUser. Status: {}",
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()).toString());
			return new ResponseEntity<>(inventoryServiceException.getErrorDetails(),
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()));
		}
	}
	
	@Override
	@GetMapping("/InvRoles")
	public ResponseEntity<Object> getRoles() {
		try {
			log.info("getRoles request recieved.");
			return ResponseEntity.ok(invRolesService.getRoles());
		} catch (AvailabilityServiceException inventoryServiceException) {
			log.error("Exception occured while fetching roles. Status: {}",
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()).toString());
			return new ResponseEntity<>(inventoryServiceException.getErrorDetails(),
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()));
		}
	}
	
	@Override
	@PostMapping("/InvRoles")
	public ResponseEntity<Object> createRole(@RequestBody RoleDetails roleDetails) {
		try {
			log.info("createRole request recieved: {}", roleDetails);
			invRolesService.createRole(roleDetails);
			return ResponseEntity.ok().build();
		} catch (AvailabilityServiceException inventoryServiceException) {
			log.error("Exception occured while creating Role. Status: {}",
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()).toString());
			return new ResponseEntity<>(inventoryServiceException.getErrorDetails(),
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()));
		}
	}
	
	@Override
	@DeleteMapping("/InvRoles/{roleId}")
	public ResponseEntity<Object> deleteRole(@PathVariable String roleId) {
		try {
			log.info("deleteRole request recieved roleId: {}", roleId);
			invRolesService.deleteRole(roleId);
			return ResponseEntity.ok().build();
		} catch (AvailabilityServiceException inventoryServiceException) {
			log.error("Exception occured while deleting role. Status: {}",
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()).toString());
			return new ResponseEntity<>(inventoryServiceException.getErrorDetails(),
					HttpStatus.resolve(inventoryServiceException.getHttpStatus()));
		}
	}
}
