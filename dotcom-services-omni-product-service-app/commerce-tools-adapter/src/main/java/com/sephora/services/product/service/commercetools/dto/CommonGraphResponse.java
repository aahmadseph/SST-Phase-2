package com.sephora.services.product.service.commercetools.dto;

import com.netflix.graphql.types.errors.TypedGraphQLError;
import lombok.Data;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Data
public class CommonGraphResponse<T> {
    private Map<String, T> data;
    private List<TypedGraphQLError> errors;

    public T getData() {
        return data.values().stream().filter(Objects::nonNull).findFirst().orElse(null);
    }
}
