package com.sephora.services.inventoryavailability.availability.metrics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.MeterRegistry;

@Component("AvailabilityMicroMeterMetricsRecorder")
public class MicroMeterMetricsRecorder {
	
    @Autowired
    private MeterRegistry micrometerRegistry;
    
    public static final String RQUEST_RECIEVED = "Requestrecieved";
    public static final String SUCCESS = "success";
    public static final String FAILED = "failed";
    public static final String DISCARDED = "discarded";
    
    // our message validation deemed failure
    public static final String DATA_VALIDATION_ERROR = "dataerror";
    
    // Connectivity issues with Yantriks
    public static final String COMMUNICATION_ERROR = "communicationerror";
    
    //  Data error reported by Yantriks  
    public static final String SERVER_DATA_VALIDATION_ERROR = "4xxError";
    
    //  No content error reported by Yantriks  
    public static final String SERVER_NO_CONTENT_ERROR = "nocontenterror";

    
    //  Server error reported by Yantriks  
    
    // Please Note that, when Server error happens we perform retry which means same messages will be reported twice
    public static final String SERVER_INTERNAL_ERROR = "5xxError";
    
    public static final String UNKNOWN_ERROR = "unknownerror";
    
    
    public static final String MESSAGE_DESERIALIZATION_ERROR = "deserializationerror";
    public static final String MESSAGE_PROCESSING_ERROR = "dataerror";
    
    Counter.Builder endPointCounter = Counter.builder("inventory.availability.request")
    		.description("Number of requests recieved by Inventory availability from Client");
    
    Counter.Builder availabilityRequestCounter = Counter.builder("inventory.availability.yantriks.request")
    		.description("Number of requests send to Yantriks by Inventory availability");
    
    Timer.Builder avaiabiltyTimeRecorder = Timer.builder("inventory.availability.yantiks.time")
    		.description("Time taken for receiving the response from Yantriks");
    
    public void incrementCounter(String endPoint, String status) {
    	endPointCounter.tags("End point", endPoint, "status", status).register(micrometerRegistry).increment();
    }
    
    public void incrementAvaiabiltyTimeRecorder(String serviceName) {
    	availabilityRequestCounter.tags("Yantriks service", serviceName).register(micrometerRegistry).increment();
    }
    
    public Timer getTimerForAvailability(String availabilityEndpoint) {
    	return avaiabiltyTimeRecorder.tag("Yantriks end point", availabilityEndpoint).register(micrometerRegistry);
    }
}
