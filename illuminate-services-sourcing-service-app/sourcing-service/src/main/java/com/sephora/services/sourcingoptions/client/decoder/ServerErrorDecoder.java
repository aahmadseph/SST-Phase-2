package com.sephora.services.sourcingoptions.client.decoder;

import feign.FeignException;
import feign.Response;
import feign.RetryableException;
import feign.codec.ErrorDecoder;

import java.util.Date;

/*@Component("ServerErrorDecoder")*/
public class ServerErrorDecoder extends ErrorDecoder.Default {
    @Override
    public Exception decode(String methodKey, Response response) {
        if (response.status() >= 500 && response.status() < 600) {
            FeignException exception = FeignException.errorStatus(methodKey, response);
            return new RetryableException(response.status(), exception.getMessage(), response.request().httpMethod(), exception, (Date)null, response.request());
        }
        return super.decode(methodKey, response);
    }
}
