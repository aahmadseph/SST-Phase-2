package com.sephora.services.inventory.validation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

/**
 * @author Vitaliy Oleksiyenko
 */
//@Configuration
public class InventoryValidationConfig {

    @Autowired
    private MessageSource messageSource;

    /**
     * Adding resource bundle for JSR303 validation on controller level.
     * For example:
     * - Path parameter validation
     * - Request parameter validation
     *
     * @return LocalValidatorFactoryBean
     */
    @Bean
    public LocalValidatorFactoryBean localValidator() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        bean.setValidationMessageSource(messageSource);
        return bean;
    }


}