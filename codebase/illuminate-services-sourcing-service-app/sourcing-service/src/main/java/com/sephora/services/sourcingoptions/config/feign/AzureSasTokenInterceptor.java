package com.sephora.services.sourcingoptions.config.feign;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AzureSasTokenInterceptor implements RequestInterceptor {

    @Value("${azure.table.sasToken}")
    private String sasToken;

    @Override
    public void apply(RequestTemplate request) {
        // Append the SAS token to the request URL if it's not already there.
        if (!request.url().contains("sig=")) {
            String url = request.url();
            String delimiter = url.contains("?") ? "&" : "?";
            request.uri(url + delimiter + sasToken);
        }
    }
}
