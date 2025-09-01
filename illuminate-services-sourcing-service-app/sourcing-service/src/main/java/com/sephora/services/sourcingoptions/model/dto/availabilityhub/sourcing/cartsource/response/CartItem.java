package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.cartsource.response;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CartItem {
	private Double fulfillQuantity;
    private Double requestQuantity;
}
