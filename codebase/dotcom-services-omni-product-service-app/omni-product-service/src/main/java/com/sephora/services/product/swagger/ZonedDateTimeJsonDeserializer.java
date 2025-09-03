package com.sephora.services.product.swagger;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class ZonedDateTimeJsonDeserializer extends JsonDeserializer<ZonedDateTime> {

    public static final ZoneId PST = ZoneId.of("America/Los_Angeles");
    public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss Z")
            .withZone(PST);

    @Override
    public ZonedDateTime deserialize(JsonParser jsonParser, DeserializationContext ctxt)
            throws IOException, JacksonException {
        String value = jsonParser.getText();
        try {
            return ZonedDateTime.parse(value, DATE_TIME_FORMATTER);
        } catch (Exception var8) {

        }
        return ZonedDateTime.now();
    }
}
