package com.sephora.services.product.service.commercetools.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor(staticName = "of")
public class SearchFilterInput {
    private final String string;
}
