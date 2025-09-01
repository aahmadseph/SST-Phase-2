package com.sephora.services.sourcingoptions.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sephora.services.sourcingoptions.model.dto.promisedate.PromiseDateResponseDto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Vitaliy Oleksiyenko
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@ApiModel(value = "SourcingOptionsResponse")
public class SourcingOptionsResponseDto {

    @ApiModelProperty(value = "${SourcingOptionsResponse.available.value}", required = true)
    private boolean available;

    @ApiModelProperty(value = "${SourcingOptionsResponse.items.value}", required = true)
    private List<SourcingOptionsResponseItemDto> items = new ArrayList<>();
    @ApiModelProperty(value = "${SourcingOptionsResponse.promiseDates.value}", required = false)
    private List<PromiseDateResponseDto> promiseDates = null;
    private Boolean datesCalculated = null;

    @ApiModelProperty(value = "${SourcingOptionsResponse.promiseDtByCarrierServiceNLocations.value}", required = false)
    private List<PromiseDtByCarrierServiceNLocation> promiseDtByCarrierServiceNLocations;

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public List<SourcingOptionsResponseItemDto> getItems() {
        return items;
    }

    public void setItems(List<SourcingOptionsResponseItemDto> items) {
        this.items = items;
    }

    public List<PromiseDateResponseDto> getPromiseDates() {
        return promiseDates;
    }

    public void setPromiseDates(List<PromiseDateResponseDto> promiseDates) {
        this.promiseDates = promiseDates;
    }

    public Boolean getDatesCalculated() {
        return datesCalculated;
    }

    public void setDatesCalculated(Boolean datesCalculated) {
        this.datesCalculated = datesCalculated;
    }

    public List<PromiseDtByCarrierServiceNLocation> getPromiseDtByCarrierServiceNLocations() {
        return promiseDtByCarrierServiceNLocations;
    }

    public void setPromiseDtByCarrierServiceNLocations(List<PromiseDtByCarrierServiceNLocation> promiseDtByCarrierServiceNLocations) {
        this.promiseDtByCarrierServiceNLocations = promiseDtByCarrierServiceNLocations;
    }

    @Override
    public String toString() {
        return "SourcingOptionsResponseDto{" +
                "available=" + available +
                ", items=" + items +
                ", promiseDates=" + promiseDates +
                '}';
    }

    public static final class Builder {
        private boolean available;
        private List<SourcingOptionsResponseItemDto> items;
        private List<PromiseDateResponseDto> promiseDates;
        private Boolean datesCalculated;

        private Builder() {
        }

        public static Builder aSourcingOptionsResponseDto() {
            return new Builder();
        }

        public Builder withAvailable(boolean available) {
            this.available = available;
            return this;
        }

        public Builder withItems(List<SourcingOptionsResponseItemDto> items) {
            this.items = items;
            return this;
        }

        public Builder withPromiseDates(List<PromiseDateResponseDto> promiseDates){
            this.promiseDates = promiseDates;
            return this;
        }

        public Builder withDatesCalculated(Boolean datesCalculated){
            this.datesCalculated = datesCalculated;
            return this;
        }

        public SourcingOptionsResponseDto build() {
            SourcingOptionsResponseDto sourcingOptionsResponseDto = new SourcingOptionsResponseDto();
            sourcingOptionsResponseDto.setAvailable(available);
            sourcingOptionsResponseDto.setItems(items);
            sourcingOptionsResponseDto.setPromiseDates(promiseDates);
            sourcingOptionsResponseDto.setDatesCalculated(datesCalculated);
            return sourcingOptionsResponseDto;
        }
    }
}
