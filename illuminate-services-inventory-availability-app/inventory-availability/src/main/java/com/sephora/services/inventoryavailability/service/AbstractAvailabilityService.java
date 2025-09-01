package com.sephora.services.inventoryavailability.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.sephora.services.inventoryavailability.availability.metrics.MicroMeterMetricsRecorder;

public abstract class AbstractAvailabilityService {
	@Autowired
	@Qualifier("AvailabilityMicroMeterMetricsRecorder")
	protected MicroMeterMetricsRecorder metricsRecorder;
	
	public void recordMicrometerMetrics(String topicName, String status) {
    	metricsRecorder.incrementCounter(topicName, status);
    }
}
