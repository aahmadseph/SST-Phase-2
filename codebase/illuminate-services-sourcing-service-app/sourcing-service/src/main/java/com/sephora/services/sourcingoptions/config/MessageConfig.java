package com.sephora.services.sourcingoptions.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

import static java.text.MessageFormat.format;

@Configuration("sourcingOptionsMessageSourceConfig")
@PropertySource("classpath:sourcingoptions/swagger.properties")
public class MessageConfig {

    public static final String SOURCING_MESSAGE_SOURCE = "sourcingMessageSource";
    public static final String SOURCING_ERROR_CODES_MESSAGE_SOURCE = "sourcingErrorCodesMessageSource";

    private static final String BASE_NAMES_FORMAT = "classpath:sourcingoptions/{0}";
    private static final String MESSAGES = "messages";
    private static final String ERROR_CODES = "errorCodes";

    @Bean(SOURCING_MESSAGE_SOURCE)
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(format(BASE_NAMES_FORMAT, MESSAGES));

        // Set parameter to force always use MessageFormat.format
        // to avoid confusion with escaping quotes for messages with
        // and without arguments
        messageSource.setAlwaysUseMessageFormat(true);

        return messageSource;
    }

    @Bean(SOURCING_ERROR_CODES_MESSAGE_SOURCE)
    public MessageSource errorCodesMessageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(format(BASE_NAMES_FORMAT, ERROR_CODES));
        return messageSource;
    }
}