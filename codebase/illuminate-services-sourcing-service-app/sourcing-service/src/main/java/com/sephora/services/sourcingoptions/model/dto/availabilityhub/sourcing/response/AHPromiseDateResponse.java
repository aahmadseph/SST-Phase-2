package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response;

import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.datesbyservice.DatesByServicePromiseDate;
import lombok.Data;

import java.util.ArrayList;
import java.util.Map;

@Data
public class AHPromiseDateResponse {
    private ArrayList<PromiseDate> dates;
    private Map<String, Map<String,AuditDetails>> auditDetails;
    private ArrayList<DatesByServicePromiseDate> shipments;

    public ArrayList<PromiseDate> getDates() {
        return dates;
    }

    public void setDates(ArrayList<PromiseDate> dates) {
        this.dates = dates;
    }

    public Map<String, Map<String, AuditDetails>> getAuditDetails() {
        return auditDetails;
    }

    public void setAuditDetails(Map<String, Map<String, AuditDetails>> auditDetails) {
        this.auditDetails = auditDetails;
    }

    public ArrayList<DatesByServicePromiseDate> getShipments() {
        return shipments;
    }

    public void setShipments(ArrayList<DatesByServicePromiseDate> shipments) {
        this.shipments = shipments;
    }
}
