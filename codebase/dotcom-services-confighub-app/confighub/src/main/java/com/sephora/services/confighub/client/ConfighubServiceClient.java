package com.sephora.services.confighub.client;


import feign.RequestLine;

public interface ConfighubServiceClient {
    
    @RequestLine("POST /actuator/busrefresh")
    void busRefresh();
}
