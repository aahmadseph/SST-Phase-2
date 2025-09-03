package com.sephora.services.confighub;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.loadbalancer.config.LoadBalancerCacheAutoConfiguration;

@SpringBootTest
@EnableAutoConfiguration(exclude = {
        LoadBalancerCacheAutoConfiguration.class})


@EntityScan(basePackages = "com.sephora.services.confighub.entity")
public class ConfighubApplicationTest {

     
}
