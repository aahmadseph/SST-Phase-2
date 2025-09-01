package com.sephora.services.common.inventory.audit.repository;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.sephora.services.common.inventory.audit.model.cosmos.Audit;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public interface AuditRepository extends CosmosRepository<Audit, String> {
}
