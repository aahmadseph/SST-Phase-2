package com.sephora.services.inventory.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sephora.platform.cache.service.CacheService;
import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;

import io.swagger.annotations.Api;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * Cache controller is used for providing end point for get/delete entry from cache. it is used for QA testing. 
 * @author 
 *
 */
@ControllerDocumentation
@RestController
@RequestMapping("/v1/locationAvailability/cache")
@Validated
@EnableSwagger2
@ConditionalOnProperty(prefix = "inventory.site-page-availability", name = "useRedisTemplate", havingValue = "false", matchIfMissing = true)
@Api(tags = "Cache Custom API")
public class CacheServiceController {
	@Autowired
	private CacheService cacheService;

	@GetMapping("{cacheName}/{cacheKey}")
	public Object get(@PathVariable String cacheName, @PathVariable String cacheKey) {
		return cacheService.getCacheItem(cacheName, cacheKey);
	}
	
	@DeleteMapping("{cacheName}/{cacheKey}")
	public void delete(@PathVariable String cacheName, @PathVariable String cacheKey) {
		cacheService.removeCacheItem(cacheName, cacheKey);
	}
}
