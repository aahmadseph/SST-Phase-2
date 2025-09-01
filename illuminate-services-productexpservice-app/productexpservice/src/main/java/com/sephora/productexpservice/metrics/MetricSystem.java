package com.sephora.productexpservice.metrics;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;


@Component
public class MetricSystem {
	
	@Autowired
	private MeterRegistry metricRegistry;
	
	private Counter kafkaMessageSendCount;
	private Counter kafkaMessageSendFailedCount;
	private Counter kafkaMessageReceivedCount;
	
	@PostConstruct
	public void init() {
		kafkaMessageSendCount = metricRegistry.counter("kafka.messageSendCount");
		kafkaMessageSendFailedCount = metricRegistry.counter("kafka.messageSendFailed");
		kafkaMessageReceivedCount = metricRegistry.counter("kafka.messageReceivedCount");
	}

	public Counter getKafkaMessageSendCount() {
		return kafkaMessageSendCount;
	}

	public Counter getKafkaMessageSendFailedCount() {
		return kafkaMessageSendFailedCount;
	}

	public Counter getKafkaMessageReceivedCount() {
		return kafkaMessageReceivedCount;
	}

	
}