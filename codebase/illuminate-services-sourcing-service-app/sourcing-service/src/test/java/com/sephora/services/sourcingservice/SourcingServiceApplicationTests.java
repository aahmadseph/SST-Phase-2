//package com.sephora.services.sourcingservice;
//
//import org.junit.jupiter.api.Test;
//import org.junit.runner.RunWith;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.boot.test.mock.mockito.MockBeans;
//import org.springframework.cache.jcache.JCacheCacheManager;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import com.sephora.platform.cache.controller.CacheManagerService;
//import com.sephora.services.sourcingservice.messaging.MessageConsumer;
//import com.sephora.services.sourcingservice.messaging.MessageProducer;
//import com.sephora.services.sourcingservice.repository.ReferenceRepository;
//
//@RunWith(SpringRunner.class)
//@SpringBootTest
//@ComponentScan(basePackages = {
//		"com.sephora.services.sourcingservice"
//})
//@MockBeans(value = {
//		@MockBean(ReferenceRepository.class),
//		@MockBean(CacheManagerService.class),
//		@MockBean(name = "redissonCacheManager", value = JCacheCacheManager.class),
//		@MockBean(MessageProducer.class),
//		@MockBean(MessageConsumer.class),
//		@MockBean(name = "producerKafkaTemplate", value = KafkaTemplate.class)
//})
//class SourcingServiceApplicationTests {
//
//	@Test
//	void contextLoads() {
//	}
//
//}
