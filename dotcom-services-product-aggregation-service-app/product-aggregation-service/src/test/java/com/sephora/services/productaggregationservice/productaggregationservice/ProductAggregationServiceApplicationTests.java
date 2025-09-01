package com.sephora.services.productaggregationservice.productaggregationservice;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;

import com.sephora.services.productaggregationservice.productaggregationservice.repository.ReferenceRepository;

import static org.junit.Assert.assertEquals;


@RunWith(SpringRunner.class)
@SpringBootTest
@ComponentScan(basePackages = {
		"com.sephora.services.productaggregationservice.productaggregationservice"
})
@MockBeans(value = {
		@MockBean(ReferenceRepository.class),
})
public class ProductAggregationServiceApplicationTests {

	@Test
	public void contextLoads() {
		assertEquals(1,1);
	}
}
