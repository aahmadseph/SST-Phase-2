package com.sephora.services.inventory.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
@ConditionalOnProperty(prefix = "inventory.site-page-availability", name = "useRedisTemplate", havingValue = "true")
@Api(tags = "Cache Custom API")
public class CacheController {

	@Autowired
	@Qualifier("redisInventoryServiceTemplate")
	private RedisTemplate<String, Object> invRedisTemplate;

	@GetMapping("{cacheKey}")
	public Object get(@PathVariable String cacheKey) {
		return invRedisTemplate.opsForValue().get(cacheKey);
	}

	@DeleteMapping("/{cacheKey}")
	public void delete(@PathVariable String cacheKey) {
		invRedisTemplate.delete(cacheKey);
	}
}
