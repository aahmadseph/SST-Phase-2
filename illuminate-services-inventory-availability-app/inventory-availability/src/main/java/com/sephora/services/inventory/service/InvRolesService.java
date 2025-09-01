package com.sephora.services.inventory.service;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.azure.spring.data.cosmos.exception.CosmosAccessException;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventory.mapper.InvRoleMapper;
import com.sephora.services.inventory.model.cosmos.doc.InvRoles;
import com.sephora.services.inventory.repository.cosmos.InvRolesRepository;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.invusers.RoleDetails;

import lombok.extern.log4j.Log4j2;

@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
@Service
@Log4j2
public class InvRolesService {

	@Autowired(required = false)
	InvRolesRepository invRolesRepository;

	@Autowired
	private InvRoleMapper invRoleMapper;
	
	/**
	 * 
	 * @param roleDetails
	 */
	public void createRole(RoleDetails roleDetails) throws AvailabilityServiceException {
		try {
			if(!invRolesRepository.findById(roleDetails.getId()).isEmpty()) {
				throw new AvailabilityServiceException(HttpStatus.SC_NOT_FOUND,
						ErrorResponseDTO.builder()
								.error(ErrorDetails.builder().code(MessagesAndCodes.ROLE_ALREADY_EXISTS_ERROR_CODE)
										.message(MessagesAndCodes.ROLE_ALREADY_EXISTS_ERROR_CODE_MESSAGE).build())
								.build());
			} else {
				long startTime = System.currentTimeMillis();
				log.debug("Creating new role");
				invRolesRepository.save(InvRoles.builder()
						.id(roleDetails.getId())
						.roleName(roleDetails.getRoleName())
						.privileges(roleDetails.getPrivileges()).build());
				log.info("Successfully created new role with id: {} name:{} took:{} ms", roleDetails.getId(),
						roleDetails.getRoleName(), System.currentTimeMillis() - startTime);
			}
		}catch(Exception ex) {
			log.error("Exception occured while adding new user", ex);
			if(ex instanceof AvailabilityServiceException) {
				throw ex;
			}else if(null != ex.getCause() && ex.getCause() instanceof CosmosAccessException) {
				handleCosmosException((CosmosAccessException) ex.getCause());
			}else {
	            throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR, ErrorResponseDTO.builder()
	                    .error(ErrorDetails.builder()
	                            .code(MessagesAndCodes.ROLE_UNKNOWN_ERROR_CODE)
	                            .message(MessagesAndCodes.ROLE_UNKNOWN_ERROR_CODE_MESSAGE)
	                            .build())
	                    .build());
			}
		}
	}
	
	/**
	 * 
	 * @return
	 */
	public List<String> getRoleIds() {
		List<InvRoles> roles = invRolesRepository.findAll();
		return roles.stream().map(InvRoles::getId).collect(Collectors.toList());
	}
	
	/**
	 * 
	 * @return
	 * @throws AvailabilityServiceException
	 */
	public List<RoleDetails> getRoles() throws AvailabilityServiceException {
		try {
			long startTime = System.currentTimeMillis();
			log.debug("Fetching role list");
			List<InvRoles> invRoles = invRolesRepository.findAll();
			log.info("Successfully fetched role list with {} records, took: {} ms", invRoles.size(), System.currentTimeMillis() - startTime);
			return invRoles.stream().map(invRole -> {
				return invRoleMapper.convert(invRole);
			}).collect(Collectors.toList());
		} catch (Exception e) {
			log.error("Exception occured while getting user role from db", e);
			if (null != e.getCause() && e.getCause() instanceof CosmosAccessException) {
				handleCosmosException((CosmosAccessException) e.getCause());
			} else {
				throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR,
						ErrorResponseDTO.builder()
								.error(ErrorDetails.builder().code(MessagesAndCodes.ROLE_UNKNOWN_ERROR_CODE)
										.message(MessagesAndCodes.ROLE_UNKNOWN_ERROR_CODE_MESSAGE).build())
								.build());
			}
		}
		return null;
	}
	
	/**
	 * 
	 * @param roleId
	 * @throws AvailabilityServiceException
	 */
	public void deleteRole(String roleId) throws AvailabilityServiceException {
		try {
			long startTime = System.currentTimeMillis();
			Optional<InvRoles> invRoleOpt = invRolesRepository.findById(roleId);
			if(invRoleOpt.isEmpty()) {
				throw new AvailabilityServiceException(HttpStatus.SC_NOT_FOUND,
						ErrorResponseDTO.builder()
								.error(ErrorDetails.builder().code(MessagesAndCodes.ROLE_NOT_AVAILABLE_ERROR_CODE)
										.message(MessagesAndCodes.ROLE_NOT_AVAILABLE_ERROR_CODE_MESSAGE).build())
								.build());
			} else {
				log.debug("Deleting role with roleId: {}", roleId);
				invRolesRepository.delete(invRoleOpt.get());
				log.debug("Successfully deleted role with roleId: {}, took: {}", roleId, System.currentTimeMillis() - startTime);
			}
		} catch(Exception e) {
			log.error("Exception occured while deleting role with role id: {}", roleId);
			log.error(e);
			if(e instanceof AvailabilityServiceException) {
				throw e;
			}else if (null != e.getCause() && e.getCause() instanceof CosmosAccessException) {
				handleCosmosException((CosmosAccessException) e.getCause());
			} else {
	            throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR, ErrorResponseDTO.builder()
	                    .error(ErrorDetails.builder()
	                            .code(MessagesAndCodes.ROLE_UNKNOWN_ERROR_CODE)
	                            .message(MessagesAndCodes.ROLE_UNKNOWN_ERROR_CODE_MESSAGE)
	                            .build())
	                    .build());
			}
		}
	}

	public List<RoleDetails> getRoles(String[] roleIds) {
		List<RoleDetails> roleDetails = new ArrayList<RoleDetails>();
		Iterator<InvRoles> invRoles = invRolesRepository.findAllById(Arrays.asList(roleIds)).iterator();

		while (invRoles.hasNext()) {
			InvRoles invRole = invRoles.next();
			roleDetails.add(invRoleMapper.convert(invRole));
		}
		return roleDetails;
	}

	private void handleCosmosException(CosmosAccessException ex) throws AvailabilityServiceException {

		if (null != ex.getCause() && ex.getCause() instanceof UnknownHostException) {
			throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR,
					ErrorResponseDTO.builder()
							.error(ErrorDetails.builder().code(MessagesAndCodes.ROLE_CONNECTION_ERROR_CODE)
									.message(MessagesAndCodes.ROLE_CONNECTION_ERROR_CODE_MESSAGE).build())
							.build());
		} /*else if (HttpStatus.SC_NOT_FOUND == ex.statusCode()) {
			throw new AvailabilityServiceException(HttpStatus.SC_NOT_FOUND,
					ErrorResponseDTO.builder()
							.error(ErrorDetails.builder().code(MessagesAndCodes.ROLE_NOT_AVAILABLE_ERROR_CODE)
									.message(MessagesAndCodes.ROLE_NOT_AVAILABLE_ERROR_CODE_MESSAGE).build())
							.build());
		} */else {
			throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR,
					ErrorResponseDTO.builder()
							.error(ErrorDetails.builder().code(MessagesAndCodes.ROLE_UNKNOWN_ERROR_CODE)
									.message(MessagesAndCodes.ROLE_UNKNOWN_ERROR_CODE_MESSAGE).build())
							.build());
		}
	}
}
