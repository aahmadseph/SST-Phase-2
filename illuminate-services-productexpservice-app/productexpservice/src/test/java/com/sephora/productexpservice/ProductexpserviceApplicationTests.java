package com.sephora.productexpservice;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;

import com.sephora.test3.repository.ReferenceRepository;

import static org.junit.Assert.assertEquals;


@RunWith(SpringRunner.class)
@SpringBootTest
@ComponentScan(basePackages = {
		"com.sephora.productexpservice"
})
@MockBeans(value = {
		@MockBean(ReferenceRepository.class),
})
public class Test3ApplicationTests {

	@Test
	public void contextLoads() {
		assertEquals(1,1);
	}
}
