package com.sephora.services.product;


import com.sephora.services.product.service.commercetools.repository.CommerceToolsQueryExecutor;
import io.github.resilience4j.springboot3.circuitbreaker.autoconfigure.CircuitBreakerAutoConfiguration;
import io.github.resilience4j.springboot3.retry.autoconfigure.RetryAutoConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.boot.actuate.autoconfigure.metrics.cache.CacheMetricsAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ComponentScan(
        basePackages = {
                "com.sephora.platform",
                "com.sephora.services.product"
        }
)
@MockitoBean(types = CommerceToolsQueryExecutor.class)
@EnableAutoConfiguration(exclude = {
        DataSourceAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class,
        RedisRepositoriesAutoConfiguration.class,
        CacheMetricsAutoConfiguration.class,
        KafkaAutoConfiguration.class,
        ValidationAutoConfiguration.class
})
@Import({CircuitBreakerAutoConfiguration.class, RetryAutoConfiguration.class})
public class OmniProductServiceApplicationTests {

    @Test
    public void contextLoads(ApplicationContext context) {
        assertThat(context).isNotNull();
    }
}
