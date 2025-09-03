package com.sephora.services.common.inventory.audit.service;

import com.sephora.services.common.inventory.audit.model.cosmos.Audit;
import com.sephora.services.common.inventory.audit.repository.AuditRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public class AuditService {

    @Autowired(required = false)
    private AuditRepository auditRepository;

    @Async
    public void save(Audit audit) {
        try {
            if (auditRepository != null) {
                log.info("received audit request with referenceType: {} and referenceValue: {}",
                        audit.getReferenceType(), audit.getReferenceValue());
                log.debug("received request to audit, request: {}", audit);
                auditRepository.save(audit);
            } else {
                log.error("audit not saved because auditRepository is not available");
            }
        } catch (Exception e) {
            log.error(e);
        }

    }
}
