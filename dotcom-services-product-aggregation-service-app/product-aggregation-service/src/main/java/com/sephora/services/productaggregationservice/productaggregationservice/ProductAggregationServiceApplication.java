package com.sephora.services.productaggregationservice.productaggregationservice;

import com.azure.spring.data.cosmos.repository.config.EnableCosmosRepositories;
import com.sephora.services.productaggregationservice.productaggregationservice.configuration.CosmosDBConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.metrics.cache.CacheMetricsAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

import static org.springframework.context.annotation.FilterType.REGEX;

@SpringBootApplication
@EnableAutoConfiguration(exclude = {
		DataSourceAutoConfiguration.class,
		HibernateJpaAutoConfiguration.class,
		//SimpleDiscoveryClientAutoConfiguration.class,
		RedisAutoConfiguration.class,
		RedisRepositoriesAutoConfiguration.class, CacheMetricsAutoConfiguration.class,
		KafkaAutoConfiguration.class
})

@ComponentScan(basePackages = {
	"com.sephora.platform",
	"com.sephora.services.productaggregationservice"
})
public class ProductAggregationServiceApplication {

	public static void main(String[] args) {
	  SpringApplication.run(ProductAggregationServiceApplication.class, args);
	}
}
