package com.sephora.services.confighub.config;

import static java.text.MessageFormat.format;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class MessageConfig {

    public static final String MESSAGE_SOURCE = "messageSource";
    public static final String ERROR_CODES_MESSAGE_SOURCE = "errorCodesMessageSource";
    public static final String LOCAL_VALIDATOR_FACTORY_BEAN = "localValidatorFactoryBean";

    private static final String BASE_NAMES_FORMAT = "classpath:configuration/{0}";
    private static final String MESSAGES = "messages";
    private static final String ERROR_CODES = "errorCodes";

    @Bean(MESSAGE_SOURCE)
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(format(BASE_NAMES_FORMAT, MESSAGES));

        // Set parameter to force always use MessageFormat.format
        // to avoid confusion with escaping quotes for messages with
        // and without arguments
        messageSource.setAlwaysUseMessageFormat(true);

        return messageSource;
    }

    @Bean(ERROR_CODES_MESSAGE_SOURCE)
    public MessageSource errorCodesMessageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(format(BASE_NAMES_FORMAT, ERROR_CODES));
        return messageSource;
    }
    
    @Qualifier
    @Primary
    @Bean(LOCAL_VALIDATOR_FACTORY_BEAN)
    public LocalValidatorFactoryBean validator() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        bean.setValidationMessageSource(messageSource());
        return bean;
    }
}
