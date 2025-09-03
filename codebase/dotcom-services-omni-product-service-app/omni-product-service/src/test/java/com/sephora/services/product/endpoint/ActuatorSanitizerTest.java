package com.sephora.services.product.endpoint;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.SanitizableData;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import static org.assertj.core.api.Assertions.assertThat;

@SpringJUnitConfig(
        classes = ActuatorSanitizer.class,
        initializers = ConfigDataApplicationContextInitializer.class
)
@EnableConfigurationProperties(ActuatorSanitizer.SanitizerProperties.class)
class ActuatorSanitizerTest {

    @Autowired
    private ActuatorSanitizer sanitizer;

    @ParameterizedTest
    @ValueSource(strings = {
            "SPRING_DATA_REDIS_PASSWORD", "CT_CLIENT_ID",
            "CT_CLIENT_SECRET", "KEYVAULT_IDENTIFIER", "sephora.commercetools.clientId"
    })
    void whenGetValue_shouldReturnSanitized(String key) {
        var data = sanitizer.apply(new SanitizableData(null, key, "secret"));
        assertThat(data).isNotNull();
        assertThat(data.getValue()).isNotNull()
                .isEqualTo(SanitizableData.SANITIZED_VALUE);
    }

    @Test
    void whenGetValue_shouldReturnValue() {
        var data = sanitizer.apply(new SanitizableData(null, "spring.data.data.redis.host",
                "localhost"));
        assertThat(data).isNotNull();
        assertThat(data.getValue()).isNotNull()
                .isEqualTo("localhost");
    }
}