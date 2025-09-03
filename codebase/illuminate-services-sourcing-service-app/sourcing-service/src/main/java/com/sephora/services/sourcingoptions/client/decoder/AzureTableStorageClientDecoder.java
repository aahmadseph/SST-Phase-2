package com.sephora.services.sourcingoptions.client.decoder;

import feign.Response;
import feign.RetryableException;
import feign.codec.ErrorDecoder;
import org.springframework.stereotype.Component;

@Component("AzureTableStorageClientDecoder")
public class AzureTableStorageClientDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {
        if (response.status() >= 500 && response.status() < 600) {
            throw new RetryableException(
                    response.status(), "Retryable error: " + response.status(),
                    response.request().httpMethod(), null, null, response.request()
            );
        }
        return new Exception("Error while calling azure table storage: " + response.status());
    }
}
