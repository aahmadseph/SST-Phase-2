package com.sephora.services.sourcingoptions.model;

import com.netflix.graphql.dgs.DgsScalar;
import graphql.language.StringValue;
import graphql.schema.*;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@DgsScalar(name = "DateTime")
public class DateTimeScalar implements Coercing<String, String> {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @Override
    public String serialize(Object dataFetcherResult) {
        if (dataFetcherResult instanceof OffsetDateTime) {
            return ((OffsetDateTime) dataFetcherResult).format(formatter);
        } else {
            throw new CoercingSerializeException("Unable to serialize object as DateTime");
        }
    }

    @Override
    public String parseValue(Object input) {
        try {
            if (input instanceof String) {
                return (String) input;
            } else {
                throw new CoercingParseValueException("Unable to parse input as DateTime");
            }
        } catch (Exception e) {
            throw new CoercingParseValueException("Unable to parse input as DateTime", e);
        }
    }

    @Override
    public String parseLiteral(Object input) {
        if (input instanceof StringValue) {
            try {
                return ((StringValue) input).getValue();
            } catch (Exception e) {
                throw new CoercingParseLiteralException("Unable to parse input as DateTime", e);
            }
        }
        throw new CoercingParseLiteralException("Expected AST type 'StringValue'");
    }
}
