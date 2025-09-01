package com.sephora.services.confighub.controller.impl;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.platform.common.validation.exception.ValidationException;
import com.sephora.services.confighub.controller.ConfighubController;
import com.sephora.services.confighub.dto.ChannelPropertyDto;
import com.sephora.services.confighub.dto.PageDTO;
import com.sephora.services.confighub.dto.PropertyValuesDtoResponse;
import com.sephora.services.confighub.dto.UpdatePropertyValuesDto;
import com.sephora.services.confighub.entity.Configuration;
import com.sephora.services.confighub.entity.ConfigurationGroup;
import com.sephora.services.confighub.exception.ConfigurationServiceException;
import com.sephora.services.confighub.service.ConfigurationService;

import lombok.extern.slf4j.Slf4j;

@CrossOrigin
@RestController
@RequestMapping("/v1/configuration")
@ControllerDocumentation
@Validated
@Slf4j
public class ConfighubControllerImpl implements ConfighubController {

    @Autowired
    private ConfigurationService configurationService;


    /**
     * To create configuration based on request body
     *
     * @param configurationRequest
     */
    @Override
    @PostMapping
    public ResponseEntity<Object> createConfiguration(
            @RequestBody @Validated ChannelPropertyDto configurationRequest) throws Exception {
        log.info("Create configuration with input payload: {}", configurationRequest);
        try {
            List<PropertyValuesDtoResponse> responseList = configurationService.createConfiguration(configurationRequest);
            return new ResponseEntity<>(responseList, HttpStatus.OK);
        } catch (ValidationException e) {
            log.info("e.getMessage" + e.getMessage());
            throw new ValidationException(e.getMessage());
        } catch (Exception ex) {
            throw new Exception(ex);
        }

    }

    /**
     * Retrieve all configurations
     *
     * @param pageNumber
     * @param pageSize
     * @param sort
     * @param group
     * @return A List of all configurations
     */
    @Override
    @GetMapping
    public ResponseEntity<Object> fetchAllConfigurations(@RequestParam(name = "page", defaultValue = "0") @Validated int pageNumber,
                                                         @RequestParam(name = "size", defaultValue = "20") @Validated int pageSize,
                                                         @RequestParam(defaultValue = "asc") @Validated String sort,
                                                         @RequestParam(required = false) @Validated String group) {
        log.info("Retrieve all configurations");
        try {
            PageDTO<PropertyValuesDtoResponse> responseList = configurationService.fetchConfigurations(pageNumber,
                    pageSize, sort, group);
            return new ResponseEntity<>(responseList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Retrieve a single configuration by configurationId
     *
     * @param configurationId The ID of the configuration to retrieve
     * @return The configuration with the specified ID
     */
    @Override
    @GetMapping("/{configurationId}")
    public ResponseEntity<Object> getConfigurationById(
            @PathVariable @Validated Long configurationId) {
        log.info("Retrieve configuration for configId: {}", configurationId);
        try {
            PropertyValuesDtoResponse configurationResponse = configurationService.fetchConfiguration(configurationId);
            return new ResponseEntity<>(configurationResponse, HttpStatus.OK);
        } catch (NoSuchElementException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ConfigurationServiceException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Delete a configuration by configurationId
     *
     * @param configurationId The ID of the configuration to delete
     * @return A response indicating success or failure
     */
    @Override
    @DeleteMapping("/{configurationId}")
    public ResponseEntity<Object> removeConfigurations(
            @PathVariable @Validated Long configurationId) {
        log.info("Delete configuration for configId: {}", configurationId);
        try {
            configurationService.deleteConfigurationById(configurationId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    
    @Override
	@PutMapping("/{configurationId}")
	public  ResponseEntity<Object> updateConfiguration(
			@PathVariable Long configurationId,
           @RequestBody @Validated 
           UpdatePropertyValuesDto updateConfigurationRequest) {
    	try {
	    	log.info("Update configuration ={} {} with input payload: {}", configurationId, updateConfigurationRequest);
		    PropertyValuesDtoResponse response= configurationService.updateConfiguration(configurationId, updateConfigurationRequest);
		    return new ResponseEntity<>(response, HttpStatus.OK);
	    } catch (ValidationException e) {
            log.info("e.getMessage" + e.getMessage());
            throw new ValidationException(e.getMessage());
        } catch (NoSuchElementException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ConfigurationServiceException e) {
            throw new RuntimeException(e);
        }
	}
    
    @Override
   	@PutMapping("/key/{propKey}")
   	public  ResponseEntity<Object> updateConfigurationByPropKey(
   			@PathVariable String propKey,
              @RequestBody @Validated 
              UpdatePropertyValuesDto updateConfigurationRequest) {
       	try {
   	    	log.info("Update configuration by Property Key={} {} with input payload: {}", propKey, updateConfigurationRequest);
   		    PropertyValuesDtoResponse response= configurationService.updateConfigurationByPropKey(propKey, updateConfigurationRequest);
   		    return new ResponseEntity<>(response, HttpStatus.OK);
   	    } catch (NoSuchElementException ex) {
               return new ResponseEntity<>(HttpStatus.NOT_FOUND);
           } catch (ConfigurationServiceException e) {
               throw new RuntimeException(e);
           }
   	}

	@Override
	@GetMapping("/groups")
	public ResponseEntity<Object> getAllConfigurationGroups() {
        log.info("Retrieve All configuration groups");
        try {
            List<ConfigurationGroup> configurationGroups = configurationService.getConfigGroups();
            return new ResponseEntity<>(configurationGroups, HttpStatus.OK);
        } catch (ConfigurationServiceException e) {
            throw new RuntimeException(e);
        }
	}

    /**
     * Retrieve a list of configurations by groupId
     * @param groupId
     * @return list of configurations
     */
    @Override
    @GetMapping("/groups/{groupId}")
    public ResponseEntity<Object> getConfigurationGroup(@PathVariable @Validated String groupId) {
        log.info("Retrieve all configuration groups for group id - {}", groupId);
        try {
            List<Configuration> configurationGroups = configurationService.getConfigGroup(groupId);
            return new ResponseEntity<>(configurationGroups, HttpStatus.OK);
        } catch (ConfigurationServiceException e) {
            throw new RuntimeException(e);
        }
    }

}


