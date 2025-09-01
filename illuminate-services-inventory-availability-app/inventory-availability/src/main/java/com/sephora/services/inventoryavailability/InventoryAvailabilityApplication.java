package com.sephora.services.inventoryavailability;

import com.google.common.base.Predicates;
import com.sephora.services.inventory.config.AvailabilityHubMissConfiguration;
import com.sephora.services.inventory.config.MockSitePagesConfiguration;
import com.sephora.services.inventoryavailability.config.GetAvailabilityConfig;
import com.sephora.services.inventoryavailability.config.SephoraBulkInventorySupplyConfiguration;
import com.sephora.services.inventoryavailability.config.SephoraEmailConfiguration;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.spring.web.plugins.WebMvcRequestHandlerProvider;

import java.lang.reflect.Field;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


/***
 * 
 * @author nevinalex
 *
 */
@SpringBootApplication

@ComponentScan(basePackages = { "com.sephora.platform", "com.sephora.services", "com.sephora.confighubclient"})

@EnableAutoConfiguration(exclude = { HibernateJpaAutoConfiguration.class,
		SimpleDiscoveryClientAutoConfiguration.class,
		DataSourceAutoConfiguration.class,
	      HibernateJpaAutoConfiguration.class,
	      SimpleDiscoveryClientAutoConfiguration.class,
	      RedisAutoConfiguration.class,
	      RedisRepositoriesAutoConfiguration.class,
		SecurityAutoConfiguration.class,
		ManagementWebSecurityAutoConfiguration.class,
		org.springframework.boot.actuate.autoconfigure.metrics.cache.CacheMetricsAutoConfiguration.class

})
@EnableAsync
@PropertySource("classpath:swagger.properties")
@EnableDiscoveryClient
@EnableScheduling
@EnableConfigurationProperties(value = {SephoraEmailConfiguration.class, SephoraBulkInventorySupplyConfiguration.class, 
		MockSitePagesConfiguration.class, 
		AvailabilityHubMissConfiguration.class,
		GetAvailabilityConfig.class})
public class InventoryAvailabilityApplication {
	public static final String INVENTORY_MESSAGE_SOURCE = "inventoryMessageSource";
	public static final String INVENTORY_ERROR_CODES_MESSAGE_SOURCE = "inventoryErrorCodesMessageSource";
	@Autowired
	private Environment environment;
	@Bean(INVENTORY_MESSAGE_SOURCE)
	public MessageSource messageSource() {
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasenames("classpath:messages");

		// Set parameter to force always use MessageFormat.format
		// to avoid confusion with escaping quotes for messages with
		// and without arguments
		messageSource.setAlwaysUseMessageFormat(true);

		return messageSource;
	}

	@Bean(INVENTORY_ERROR_CODES_MESSAGE_SOURCE)
	public MessageSource errorCodesMessageSource() {
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasenames("classpath:errorCodes");
		return messageSource;
	}

	@Bean
	public Docket api() {
		return new Docket(DocumentationType.SWAGGER_2)
				.select()
				.apis(Predicates.not(RequestHandlerSelectors.basePackage("org.springframework.boot"))).build().apiInfo(getApiInfo());

	}

	private ApiInfo getApiInfo() {
		return new ApiInfoBuilder()
				.description(getBuildInformation())
				.title(environment.getProperty("application.title"))
				.version(environment.getProperty("application.version"))
				.build();
	}

	private String getBuildInformation() {
		String buildNumber = environment.getProperty("application.build.number");
		String branchName = environment.getProperty("application.build.branch");
		String buildDateTime = environment.getProperty("application.build.datetime");
		String lastCommit = environment.getProperty("application.build.commit");

		return "<b>Build Number: </b>" + buildNumber + "\n" +
				"<b>Branch: </b> " + branchName + "\n" +
				"<b>Build date: </b> " + buildDateTime + "\n" +
				"<b>Last commit: </b> " + lastCommit + "\n";
	}

	@Bean
	public static BeanPostProcessor springfoxHandlerProviderBeanPostProcessor() {
		return new BeanPostProcessor() {

			@Override
			public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
				if (bean instanceof WebMvcRequestHandlerProvider) {
					customizeSpringfoxHandlerMappings(getHandlerMappings(bean));
				}
				return bean;
			}

			private <T extends RequestMappingInfoHandlerMapping> void customizeSpringfoxHandlerMappings(List<T> mappings) {
				List<T> copy = mappings.stream()
						.filter(mapping -> mapping.getPatternParser() == null)
						.collect(Collectors.toList());
				mappings.clear();
				mappings.addAll(copy);
			}

			@SuppressWarnings("unchecked")
			private List<RequestMappingInfoHandlerMapping> getHandlerMappings(Object bean) {
				try {
					Field field = ReflectionUtils.findField(bean.getClass(), "handlerMappings");
					field.setAccessible(true);
					return (List<RequestMappingInfoHandlerMapping>) field.get(bean);
				} catch (IllegalArgumentException | IllegalAccessException e) {
					throw new IllegalStateException(e);
				}
			}
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(InventoryAvailabilityApplication.class, args);
	}

}
