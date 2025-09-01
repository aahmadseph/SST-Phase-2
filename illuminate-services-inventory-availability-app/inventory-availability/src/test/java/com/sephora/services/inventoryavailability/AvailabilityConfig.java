package com.sephora.services.inventoryavailability;


import com.netflix.graphql.dgs.internal.DgsSchemaProvider;
import com.sephora.services.inventory.config.GetAvailabilityForSitePagesConfig;
import com.sephora.services.inventory.service.GetAvailabilityForSitePagesService;
import com.sephora.services.inventory.service.availability.NetworkAvailabilityService;
import com.sephora.services.inventory.service.availability.impl.CacheAvailabilityService;
import com.sephora.services.inventory.service.availability.impl.IntransitCacheAvailabilityService;
import com.sephora.services.inventory.service.availability.impl.NetworkAvailabilityServiceImpl;
import com.sephora.services.inventoryavailability.mapping.InventoryAvailabilityMapperImpl;
import com.sephora.services.inventoryavailability.model.dto.graphql.DateTimeScalar;
import com.sephora.services.inventoryavailability.service.*;

import graphql.schema.GraphQLScalarType;
import graphql.schema.GraphQLSchema;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.core.task.SimpleAsyncTaskExecutor;

import com.sephora.services.inventoryavailability.availability.metrics.MicroMeterMetricsRecorder;
import com.sephora.services.inventoryavailability.config.redis.GetAvailabilityForSitePagesAsyncConfig;
import com.sephora.services.inventoryavailability.mapping.GetInventorySupplyMapper;
import com.sephora.services.inventoryavailability.mapping.InventorySupplyMapper;

import java.io.IOException;

@Configuration("inventoryTestConfig")
public class AvailabilityConfig {
	
	@Bean
	@Scope("prototype")
	InventorySupplyMapper getInventorySupplyMapper() {
		return new InventorySupplyMapper();
	}
	
	@Bean
	@Scope("prototype")
	GetInventorySupplyMapper searchInventorySupplyMapper() {
		return new GetInventorySupplyMapper();
	}
	
	@Bean
	@Scope("prototype")
	UpdateInventorySupplyService updateInventorySupplyService() {
		return new UpdateInventorySupplyService();
	}
	@Bean
	@Scope("prototype")
	GetInventorySupplyService getInventorySupplyService() {
		return new GetInventorySupplyService();
	}

	@Bean
	@Scope("prototype")
	GetInventoryAvailabilityService getInventoryAvailabilityService(){
		return new GetInventoryAvailabilityService();
	}
			
	@Bean
	@Scope("prototype")
	AvailabilityHubInventoryService availabilityHubInventoryService(){
		return new AvailabilityHubInventoryService();
	}
	@Bean("AvailabilityMicroMeterMetricsRecorder")
	@Scope("prototype")
	MicroMeterMetricsRecorder aicroMeterMetricsRecorder() {
		return new MicroMeterMetricsRecorder();
	}
	
	@Bean
	@Scope("prototype")
	DeleteInventoryControlService deleteInventoryControlService() {
		return new DeleteInventoryControlService();
	}
	
	
	@Bean

	@Scope("prototype")
	GetAvailabilityForSitePagesService getAvailabilityForSitePagesService() {
		return new GetAvailabilityForSitePagesService();
	}
	 
	
	@Bean(GetAvailabilityForSitePagesAsyncConfig.THREAD_POOL)
	@Scope("prototype")
	AsyncTaskExecutor threadPoolTaskExecutorService() {
		AsyncTaskExecutor mockExecutor = new SimpleAsyncTaskExecutor();
		return mockExecutor;
	}

	@Bean
	@Scope("prototype")
	HoldItemService itemHoldService(){
		return new HoldItemService();
	}
	
	@Bean
	@Scope("prototype")
	GetAvailabilityCacheService getAvailabilityCacheService() {
		return new GetAvailabilityCacheService();
	}
	
	@Bean(GetAvailabilityForSitePagesAsyncConfig.CACHE_THREAD_POOL)
	@Scope("prototype")
	AsyncTaskExecutor threadPoolTaskExecutor() {
		AsyncTaskExecutor mockExecutor = new SimpleAsyncTaskExecutor();
		return mockExecutor;
	}
	
	@Bean
	@Scope("prototype")
	NetworkAvailabilityService networkAvailabilityService() {
		return new NetworkAvailabilityServiceImpl();
	}
	@Bean
	@Scope("prototype")
	CacheAvailabilityService cacheAvailabilityService() {
		return new CacheAvailabilityService();
	}

	@Bean
	@Scope("prototype")
	public GraphQLSchema graphQLSchema(DgsSchemaProvider dgsSchemaProvider) throws IOException {
		GraphQLSchema schema = Mockito.mock(GraphQLSchema.class);
		return schema;
	}

	@Bean
	@Scope("prototype")
	public GraphQLScalarType dateTimeScalar() {
		return GraphQLScalarType.newScalar().name("DateTime").coercing(new DateTimeScalar()).build();
	}

	@Bean
	@Scope("prototype")
	public IntransitCacheAvailabilityService intransitCacheAvailabilityService() {
		return new IntransitCacheAvailabilityService();
	}

	@Bean
	@Scope("prototype")
	public IntransitInventoryService intransitInventoryService() {
		return new IntransitInventoryService();
	}

	@Bean
	@Scope("prototype")
	public InventoryAvailabilityMapperImpl inventoryAvailabilityMapper() {
		return new InventoryAvailabilityMapperImpl();
	}

	@Bean(GetAvailabilityForSitePagesAsyncConfig.INTRANSIT_THREAD_POOL)
	@Scope("prototype")
	AsyncTaskExecutor inTransitThreadPoolTaskExecutorService() {
		return new SimpleAsyncTaskExecutor();
	}

	@Bean
	@Scope("prototype")
	GetAvailabilityForSitePagesConfig getAvailabilityForSitePagesConfig() {
		return new GetAvailabilityForSitePagesConfig();
	}
}
