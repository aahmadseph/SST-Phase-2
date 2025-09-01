package com.sephora.services.confighub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sephora.services.confighub.entity.AuditConfiguration;

@Repository
public interface AuditConfigurationRepository extends JpaRepository<AuditConfiguration, Long> {
}
