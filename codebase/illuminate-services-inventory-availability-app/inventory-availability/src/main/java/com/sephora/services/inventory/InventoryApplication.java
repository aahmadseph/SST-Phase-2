/*
 * This software is the confidential and proprietary information of sephora.com
 * and may not be used, reproduced, modified, distributed, publicly displayed or
 * otherwise disclosed without the express written consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by the
 * copyright laws of the United States and foreign jurisdictions.
 *
 * Copyright 2019 sephora.com, Inc. All rights reserved.
 * 
 * 
 * package com.sephora.services.inventory;
 * 
 * import org.springframework.boot.SpringApplication; import
 * org.springframework.boot.autoconfigure.EnableAutoConfiguration; import
 * org.springframework.boot.autoconfigure.SpringBootApplication; import
 * org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
 * import org.springframework.boot.autoconfigure.data.redis.
 * RedisRepositoriesAutoConfiguration; import
 * org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
 * import
 * org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
 * import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
 * import org.springframework.cloud.client.discovery.simple.
 * SimpleDiscoveryClientAutoConfiguration; import
 * org.springframework.context.MessageSource; import
 * org.springframework.context.annotation.Bean; import
 * org.springframework.context.annotation.Configuration; import
 * org.springframework.context.support.ReloadableResourceBundleMessageSource;
 * 
 * 
 *//**
	 * @author Alexey Zalivko 5/2/2019
	 *//*
		 * 
		 * 
		 * @SpringBootApplication(scanBasePackages = { "com.sephora.services.commons",
		 * "com.sephora.services.inventory", "com.sephora.services.availability" })
		 * 
		 * @EnableAutoConfiguration(exclude={ DataSourceAutoConfiguration.class,
		 * HibernateJpaAutoConfiguration.class,
		 * SimpleDiscoveryClientAutoConfiguration.class, RedisAutoConfiguration.class,
		 * RedisRepositoriesAutoConfiguration.class })
		 * 
		 * @EnableDiscoveryClient
		 * 
		 * @Configuration public class InventoryApplication {
		 * 
		 * public static final String INVENTORY_MESSAGE_SOURCE =
		 * "inventoryMessageSource"; public static final String
		 * INVENTORY_ERROR_CODES_MESSAGE_SOURCE = "inventoryErrorCodesMessageSource";
		 * 
		 * 
		 * @Bean(INVENTORY_MESSAGE_SOURCE) public MessageSource messageSource() {
		 * ReloadableResourceBundleMessageSource messageSource = new
		 * ReloadableResourceBundleMessageSource();
		 * messageSource.setBasenames("classpath:messages");
		 * 
		 * // Set parameter to force always use MessageFormat.format // to avoid
		 * confusion with escaping quotes for messages with // and without arguments
		 * messageSource.setAlwaysUseMessageFormat(true);
		 * 
		 * return messageSource; }
		 * 
		 * @Bean(INVENTORY_ERROR_CODES_MESSAGE_SOURCE) public MessageSource
		 * errorCodesMessageSource() { ReloadableResourceBundleMessageSource
		 * messageSource = new ReloadableResourceBundleMessageSource();
		 * messageSource.setBasenames("classpath:errorCodes"); return messageSource; }
		 * 
		 * 
		 * public static void main(String[] args) {
		 * SpringApplication.run(InventoryApplication.class, args); }
		 * 
		 * }
		 */