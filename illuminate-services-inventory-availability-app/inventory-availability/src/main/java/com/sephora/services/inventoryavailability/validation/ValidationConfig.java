package com.sephora.services.inventoryavailability.validation;

import javax.validation.Validation;
import javax.validation.Validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.validation.beanvalidation.SpringConstraintValidatorFactory;

/**
 * @author Vitaliy Oleksiyenko
 */
@Configuration
public class ValidationConfig {

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
    @Primary
    public LocalValidatorFactoryBean localValidator() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        bean.setValidationMessageSource(messageSource);
        return bean;
    }
    
    @Bean
	public Validator getValidator(final AutowireCapableBeanFactory autowireCapableBeanFactory) {
		 return Validation.byDefaultProvider()
		        .configure().constraintValidatorFactory(new SpringConstraintValidatorFactory(autowireCapableBeanFactory))
		        .buildValidatorFactory().getValidator();
	}
}