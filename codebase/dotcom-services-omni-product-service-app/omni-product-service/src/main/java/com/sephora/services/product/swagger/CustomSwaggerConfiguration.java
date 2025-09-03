package com.sephora.services.product.swagger;

import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:swagger.properties")
public class CustomSwaggerConfiguration {

    @Bean
    public OpenApiCustomizer customizer(ChangelogConfiguration configuration) {
        return openApi -> {
            var info = openApi.getInfo();
            info.setDescription(info.getDescription() + configuration.formatedChangeLog());
            openApi.info(info);
        };
    }
}
