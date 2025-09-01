package com.sephora.services.inventory.service;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.azure.cosmos.models.PartitionKey;
import com.azure.spring.data.cosmos.exception.CosmosAccessException;
import com.azure.spring.data.cosmos.exception.CosmosExceptionUtils;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventory.mapper.InvRoleMapper;
import com.sephora.services.inventory.mapper.SaveInvUserMapper;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.cosmos.repository.InvUsersRepository;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.cosmos.doc.users.InvUsers;
import com.sephora.services.inventoryavailability.model.invusers.InvUsersListResponse;
import com.sephora.services.inventoryavailability.model.invusers.InvUsersResponse;
import com.sephora.services.inventoryavailability.model.invusers.RoleDetails;
import com.sephora.services.inventoryavailability.model.invusers.add.InvUsersRequest;

import lombok.extern.log4j.Log4j2;

@Service
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
@Log4j2
public class InvUserService {
	
	@Autowired
	InvRolesService invRolesService;
	
	@Autowired(required = false)
	InvUsersRepository invUsersRepository;
	
	@Autowired
	SaveInvUserMapper saveInvUserMapper;
	
	private String applicationId = "fulfillment-service";
	
	/**
	 * 
	 * @return
	 * @throws AvailabilityServiceException
	 */
	public InvUsersListResponse getUsers() throws AvailabilityServiceException {
		List<String> userIds = new ArrayList<String>();
		try {
			long startTime = System.currentTimeMillis(); 
			log.debug("Fetching user id list");
			List<InvUsers> invUsers = invUsersRepository.findAll();
			userIds = invUsers.stream().map(InvUsers::getUserId).collect(Collectors.toList());
			log.debug("Successfully Fetched user id list, took: {}", System.currentTimeMillis() - startTime);
		} catch (Exception e) {
			log.error("Exception occured while getting user list from db", e);

			if (null != e.getCause() && e.getCause() instanceof CosmosAccessException) {
				CosmosExceptionUtils.findAPIExceptionHandler("Exception occured while getting user list from db",e,null);
				handleCosmosException((CosmosAccessException) e.getCause());
			} else {
	            throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR, ErrorResponseDTO.builder()
	                    .error(ErrorDetails.builder()
	                            .code(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE)
	                            .message(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE_MESSAGE)
	                            .build())
	                    .build());
			}
		}
		
		return InvUsersListResponse.builder().applicationId(applicationId).users(userIds).build();
	}
	
	/**
	 * 
	 * @param invUsersRequest
	 * @throws AvailabilityServiceException
	 */
	public void saveUser(InvUsersRequest invUsersRequest) throws AvailabilityServiceException {
		try {
			long startTime = System.currentTimeMillis(); 
			if(!invUsersRepository.findById(invUsersRequest.getUserId()).isEmpty()) {
				log.info("user id is already exists = {}", invUsersRequest.getUserId());
                throw new AvailabilityServiceException(HttpStatus.SC_BAD_REQUEST, ErrorResponseDTO.builder()
                        .error(ErrorDetails.builder()
                                .code(MessagesAndCodes.USER_ALREADY_EXISTS_ERROR_CODE)
                                .message(MessagesAndCodes.USER_ALREADY_EXISTS_ERROR_CODE_MESSAGE)
                                .build())
                        .build());
			} else if(!invRolesService.getRoleIds().containsAll(invUsersRequest.getRoles())) {
				log.info("Request having invalid role id list={}", invUsersRequest.getRoles());
                throw new AvailabilityServiceException(HttpStatus.SC_BAD_REQUEST, ErrorResponseDTO.builder()
                        .error(ErrorDetails.builder()
                                .code(MessagesAndCodes.INVALID_ROLE_ERROR_CODE)
                                .message(MessagesAndCodes.INVALID_ROLE_ERROR_CODE_MESSAGE)
                                .build())
                        .build());
			}
			
			log.debug("Creating new invUser: {}", invUsersRequest);
			InvUsers invUsers = saveInvUserMapper.convert(invUsersRequest);
			invUsersRepository.save(invUsers);
			log.debug("Successfully created  new invUser, userId: {}, tooks: {} ms", invUsersRequest.getUserId(),
					System.currentTimeMillis() - startTime);
		} catch (Exception e) {
			log.error("Exception occured while adding new user", e);
			if(e instanceof AvailabilityServiceException) {
				throw e;
			}
			CosmosExceptionUtils.findAPIExceptionHandler("Exception occured while adding new user",e,null);
			if (null != e.getCause() && e.getCause() instanceof CosmosAccessException) {
				handleCosmosException((CosmosAccessException) e.getCause());
			}else {
	            throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR, ErrorResponseDTO.builder()
	                    .error(ErrorDetails.builder()
	                            .code(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE)
	                            .message(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE_MESSAGE)
	                            .build())
	                    .build());
			}
		}
	}
	
	public void updateUser(InvUsersRequest invUsersRequest) throws AvailabilityServiceException {
		try {
			long startTime = System.currentTimeMillis(); 
			if(invUsersRepository.findById(invUsersRequest.getUserId()).isEmpty()) {
				log.info("user id is not exists = {}", invUsersRequest.getUserId());
                throw new AvailabilityServiceException(HttpStatus.SC_BAD_REQUEST, ErrorResponseDTO.builder()
                        .error(ErrorDetails.builder()
                                .code(MessagesAndCodes.USER_NOT_AVAILABLE_ERROR_CODE)
                                .message(MessagesAndCodes.USER_NOT_AVAILABLE_ERROR_CODE_MESSAGE)
                                .build())
                        .build());
			} else if(!invRolesService.getRoleIds().containsAll(invUsersRequest.getRoles())) {
				log.info("Request having invalid role id list={}", invUsersRequest.getRoles());
                throw new AvailabilityServiceException(HttpStatus.SC_BAD_REQUEST, ErrorResponseDTO.builder()
                        .error(ErrorDetails.builder()
                                .code(MessagesAndCodes.INVALID_ROLE_ERROR_CODE)
                                .message(MessagesAndCodes.INVALID_ROLE_ERROR_CODE_MESSAGE)
                                .build())
                        .build());
			}
			log.debug("updating new invUser: {}", invUsersRequest);
			InvUsers invUsers = saveInvUserMapper.convert(invUsersRequest);
			invUsersRepository.save(invUsers);
			log.debug("Successfully updated invUser, userId: {}, tooks: {} ms", invUsersRequest.getUserId(),
					System.currentTimeMillis() - startTime);
		} catch (Exception e) {
			log.error("Exception occured while adding new user", e);
			if(e instanceof AvailabilityServiceException) {
				throw e;
			}
			CosmosExceptionUtils.findAPIExceptionHandler("Exception occured while adding new user",e,null);
			if (null != e.getCause() && e.getCause() instanceof CosmosAccessException) {
				handleCosmosException((CosmosAccessException) e.getCause());
			}else {
	            throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR, ErrorResponseDTO.builder()
	                    .error(ErrorDetails.builder()
	                            .code(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE)
	                            .message(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE_MESSAGE)
	                            .build())
	                    .build());
			}
		}
	}
	
	/**
	 * 
	 * @param userId
	 * @throws AvailabilityServiceException
	 */
	public void deleteUser(String userId) throws AvailabilityServiceException {
		try {
			long startTime = System.currentTimeMillis(); 
			log.debug("Deleting invUser: user id: {}", userId);
			invUsersRepository.deleteById(userId, new PartitionKey(userId));
			log.info("Successfully deleted user id: {}", userId, System.currentTimeMillis() - startTime);
		} catch (Exception e) {
			log.error("Exception occured while deleting user with user id: {}", userId);
			log.error(e);
			CosmosExceptionUtils.findAPIExceptionHandler("Exception occured while deleting user with user id",e,null);
			if (null != e.getCause() && e.getCause() instanceof CosmosAccessException) {
				handleCosmosException((CosmosAccessException) e.getCause());
			} else {
	            throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR, ErrorResponseDTO.builder()
	                    .error(ErrorDetails.builder()
	                            .code(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE)
	                            .message(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE_MESSAGE)
	                            .build())
	                    .build());
			}
		}
	}
	
	/**
	 * 
	 * @param userId
	 * @return
	 * @throws AvailabilityServiceException
	 */
	public InvUsersResponse getUserDetails(String userId) throws AvailabilityServiceException {
		try {
			long startTime = System.currentTimeMillis(); 
			log.debug("Fetching user details for userid: {}", userId);
			Optional<InvUsers> opt = invUsersRepository.findById(userId);
			if(opt.isEmpty()) {
				throw new AvailabilityServiceException(HttpStatus.SC_NOT_FOUND, ErrorResponseDTO.builder()
	                    .error(ErrorDetails.builder()
	                            .code(MessagesAndCodes.USER_NOT_AVAILABLE_ERROR_CODE)
	                            .message(MessagesAndCodes.USER_NOT_AVAILABLE_ERROR_CODE_MESSAGE)
	                            .build())
	                    .build());
			} else {
				InvUsers invUsers = opt.get();
				List<RoleDetails> roleDetails = invRolesService.getRoles(invUsers.getRoles());
				log.debug("Successfully fetched user details for userid: {}, took: {}", userId, System.currentTimeMillis() - startTime);
				return InvUsersResponse.builder()
						.userId(invUsers.getUserId())
						.roles(roleDetails)
						.build();
			}
		} catch(Exception e) {
			log.error("Exception occured while adding new user", e);

			if(e instanceof AvailabilityServiceException) {
				throw e;
			} else if (null != e.getCause() && e.getCause() instanceof CosmosAccessException) {
				CosmosExceptionUtils.findAPIExceptionHandler("Exception occured while adding new user",e,null);
				handleCosmosException((CosmosAccessException) e.getCause());
			} else {
	            throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR, ErrorResponseDTO.builder()
	                    .error(ErrorDetails.builder()
	                            .code(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE)
	                            .message(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE_MESSAGE)
	                            .build())
	                    .build());
			}
		}
		return null;
	}
	
	private void handleCosmosException(CosmosAccessException ex) throws AvailabilityServiceException {
		
		if (null != ex.getCause() && ex.getCause() instanceof UnknownHostException) {
			throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR, ErrorResponseDTO.builder()
					.error(ErrorDetails.builder()
							.code(MessagesAndCodes.USER_CONNECTION_ERROR_CODE)
							.message(MessagesAndCodes.USER_CONNECTION_ERROR_CODE_MESSAGE)
							.build())
					.build());
		}
		/*} else if(HttpStatus.SC_NOT_FOUND == ex.getCause().getMessage()) {
			throw new AvailabilityServiceException(HttpStatus.SC_NOT_FOUND, ErrorResponseDTO.builder()
                    .error(ErrorDetails.builder()
                            .code(MessagesAndCodes.USER_NOT_AVAILABLE_ERROR_CODE)
                            .message(MessagesAndCodes.USER_NOT_AVAILABLE_ERROR_CODE_MESSAGE)
                            .build())
                    .build());
		}*/ else {
			 throw new AvailabilityServiceException(HttpStatus.SC_INTERNAL_SERVER_ERROR, ErrorResponseDTO.builder()
	                    .error(ErrorDetails.builder()
	                            .code(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE)
	                            .message(MessagesAndCodes.USER_UNKNOWN_ERROR_CODE_MESSAGE)
	                            .build())
	                    .build());
		}
	}
}
