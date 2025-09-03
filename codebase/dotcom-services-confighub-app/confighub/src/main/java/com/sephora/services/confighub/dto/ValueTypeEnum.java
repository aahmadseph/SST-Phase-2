package com.sephora.services.confighub.dto;

public enum ValueTypeEnum {
	BOOLEAN("0"),
	INTEGER("1"),
	DOUBLE("2"),
	STRING("3")
	;
	
	final String type;
	ValueTypeEnum(String type) {
		this.type = type;
	}
	
	public String getType() {
		return this.type;
	}
}
