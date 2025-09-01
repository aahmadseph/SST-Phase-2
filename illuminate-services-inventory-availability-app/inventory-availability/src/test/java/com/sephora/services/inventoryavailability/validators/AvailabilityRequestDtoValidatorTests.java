package com.sephora.services.inventoryavailability.validators;

import com.sephora.services.common.inventory.validators.Validator;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = { AvailabilityConfig.class, Validator.class}, initializers = ConfigDataApplicationContextInitializer.class)
@TestPropertySource("classpath:application-test.yaml")
public class AvailabilityRequestDtoValidatorTests {

    @Autowired
    Validator validator;

    @Test
    public void testValidRequest(){
        AvailabilityRequestDto availabilityRequestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        ValidationTestUtils.validate(validator, availabilityRequestDto, 0);
    }

    @Test
    public void testInvalidRequests(){
        AvailabilityRequestDto availabilityRequestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        availabilityRequestDto.setSellingChannel(null);
        //testing selling channel
        ValidationTestUtils.validate(validator, availabilityRequestDto, 1);
        availabilityRequestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        availabilityRequestDto.setProducts(null);
        //testing products null check
        ValidationTestUtils.validate(validator, availabilityRequestDto, 2);
        availabilityRequestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        availabilityRequestDto.setProducts(new ArrayList<>());
        //testing products empty array
        ValidationTestUtils.validate(validator, availabilityRequestDto, 1);
        availabilityRequestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        availabilityRequestDto.getProducts().get(0).setProductId(null);
        //testing productId
        ValidationTestUtils.validate(validator, availabilityRequestDto, 1);
        availabilityRequestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        availabilityRequestDto.getProducts().get(0).setUom(null);
        //testing uom
        ValidationTestUtils.validate(validator, availabilityRequestDto, 1);
        availabilityRequestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        availabilityRequestDto.getProducts().get(0).setLocations(null);
        //testing locations null
        ValidationTestUtils.validate(validator, availabilityRequestDto, 2);
        availabilityRequestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        availabilityRequestDto.getProducts().get(0).setLocations(new ArrayList<>());
        //testing locations empty
        ValidationTestUtils.validate(validator, availabilityRequestDto, 1);
        availabilityRequestDto = TestUtils.buildAvailabilityRequestDtoFromConstants();
        availabilityRequestDto.getProducts().get(0).getLocations().get(0).setLocationId(null);
        //testing locationId null
        ValidationTestUtils.validate(validator, availabilityRequestDto, 1);
    }


}
