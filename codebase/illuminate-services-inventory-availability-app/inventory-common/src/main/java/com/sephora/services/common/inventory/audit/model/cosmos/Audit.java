package com.sephora.services.common.inventory.audit.model.cosmos;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.sephora.services.common.inventory.audit.AuditConstants;
import lombok.Builder;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.annotate.JsonPropertyOrder;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.springframework.data.annotation.Id;


@Container(containerName = AuditConstants.AUDIT_COLLECTION)
@CosmosIndexingPolicy(
        includePaths = { "/formName/?", "/employeeId/?", "/operation/?" },
        excludePaths = "/*" )
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
@JsonPropertyOrder({
        "operation",
        "employeeId",
        "formName",
        "referenceType",
        "referenceValue",
        "changes",
        "createts",
        "_rid",
        "_self",
        "_etag",
        "_attachments",
        "_ts"
})
@Builder
public class Audit {

    @Id
    private String id;
    @JsonProperty("operation")
    private String operation;
    @JsonProperty("employeeId")
    @PartitionKey
    private String employeeId;
    @JsonProperty("formName")
    private String formName;
    @JsonProperty("referenceType")
    private String referenceType;
    @JsonProperty("referenceValue")
    private String referenceValue;
    @JsonProperty("changes")
    private String changes;
    @JsonProperty("createts")
    private String createts;
    /*@JsonProperty("_rid")
    private String rid;
    @JsonProperty("_self")
    private String self;
    @JsonProperty("_etag")
    private String etag;*/
    /*@JsonProperty("_attachments")
    private String attachments;
    @JsonProperty("_ts")
    private Integer ts;*/

    @JsonProperty("operation")
    public String getOperation() {
        return operation;
    }

    @JsonProperty("operation")
    public void setOperation(String operation) {
        this.operation = operation;
    }

    @JsonProperty("employeeId")
    public String getEmployeeId() {
        return employeeId;
    }

    @JsonProperty("employeeId")
    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    @JsonProperty("formName")
    public String getFormName() {
        return formName;
    }

    @JsonProperty("formName")
    public void setFormName(String formName) {
        this.formName = formName;
    }

    @JsonProperty("referenceType")
    public String getReferenceType() {
        return referenceType;
    }

    @JsonProperty("referenceType")
    public void setReferenceType(String referenceType) {
        this.referenceType = referenceType;
    }

    @JsonProperty("referenceValue")
    public String getReferenceValue() {
        return referenceValue;
    }

    @JsonProperty("referenceValue")
    public void setReferenceValue(String referenceValue) {
        this.referenceValue = referenceValue;
    }

    @JsonProperty("changes")
    public String getChanges() {
        return changes;
    }

    @JsonProperty("changes")
    public void setChanges(String changes) {
        this.changes = changes;
    }

    @JsonProperty("createts")
    public String getCreatets() {
        return createts;
    }

    @JsonProperty("createts")
    public void setCreatets(String createts) {
        this.createts = createts;
    }

    /*@JsonProperty("_rid")
    public String getRid() {
        return rid;
    }

    @JsonProperty("_rid")
    public void setRid(String rid) {
        this.rid = rid;
    }

    @JsonProperty("_self")
    public String getSelf() {
        return self;
    }

    @JsonProperty("_self")
    public void setSelf(String self) {
        this.self = self;
    }

    @JsonProperty("_etag")
    public String getEtag() {
        return etag;
    }

    @JsonProperty("_etag")
    public void setEtag(String etag) {
        this.etag = etag;
    }*/

   /* @JsonProperty("_attachments")
    public String getAttachments() {
        return attachments;
    }

    @JsonProperty("_attachments")
    public void setAttachments(String attachments) {
        this.attachments = attachments;
    }

    @JsonProperty("_ts")
    public Integer getTs() {
        return ts;
    }

    @JsonProperty("_ts")
    public void setTs(Integer ts) {
        this.ts = ts;
    }*/

}