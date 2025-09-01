package com.sephora.services.productaggregationservice.productaggregationservice.monitor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.availability.AvailabilityChangeEvent;
import org.springframework.boot.availability.LivenessState;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class LivenessLogger {
    @Autowired
    private List<HealthIndicator> healthIndicators;

    @EventListener
    void handleLivenessStateEvent(AvailabilityChangeEvent<LivenessState> event) {
        if(event.getState() == LivenessState.BROKEN) {
            log.error("*****************************************************************************************");
            log.error("*********** L I V E N E S S   F A I L E D   F I N D   S T A T U S   B E L O W ***********");

            if(this.healthIndicators != null) {
                this.healthIndicators.stream().forEach(hi -> {
                    log.error("\t\t {} : {} ", hi.getClass(), hi.getHealth(true).getDetails());
                });
            }
            else {
                log.warn("Health check indicators were found");
            }
            log.error("*****************************************************************************************");
        }
    }
}
