package com.sephora.services.inventoryavailability.validators;

import com.sephora.services.common.inventory.validators.Validator;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateRequestDto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = { AvailabilityConfig.class, Validator.class}, initializers = ConfigDataApplicationContextInitializer.class)
@TestPropertySource("classpath:application-test.yaml")
public class ItemHoldValidationTests {

    @Autowired
    private Validator validator;

    @Test
    public void testValidRequest(){
        ItemHoldUpdateRequestDto requestDto = TestUtils.buildItemHoldUpdateRequestDtoFromConstant();
        ValidationTestUtils.validate(validator, requestDto, 0);
    }

    @Test
    public void testInvalidRequest(){
        ItemHoldUpdateRequestDto requestDto = TestUtils.buildItemHoldUpdateRequestDtoFromConstant();
        requestDto.setSellingChannel(null);
        ValidationTestUtils.validate(validator, requestDto, 1);
        requestDto = TestUtils.buildItemHoldUpdateRequestDtoFromConstant();
        requestDto.getProducts().get(0).setProductId(null);
        ValidationTestUtils.validate(validator, requestDto, 1);
        requestDto = TestUtils.buildItemHoldUpdateRequestDtoFromConstant();
        requestDto.getProducts().get(0).setOnhold(null);
        ValidationTestUtils.validate(validator, requestDto, 2);
    }


}
