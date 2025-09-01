package com.sephora.services.sourcingoptions.client.logger;

import feign.Logger;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class FeignLogger extends Logger {
    @Override
    protected void log(String configKey, String format, Object... args) {
        log.info(methodTag(configKey)+ String.format(format, args));
    }
}
