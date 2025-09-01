package com.sephora.services.confighub.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sephora.services.confighub.entity.Configuration;
import com.sephora.services.confighub.entity.MigratedConfiguration;

@Repository
public interface MigratedConfigurationRepository extends JpaRepository<MigratedConfiguration, Long> {
	/*
	@Query(value = "SELECT count(*) "
			+ "FROM config c " + "WHERE c.prop = :propKey", nativeQuery = true)
			int findByPropKey(@Param("propKey")String propKey);
	
	
	@Query(value = "SELECT * "
			+ "FROM config c " + "WHERE c.prop = :propKey", nativeQuery = true)
			Configuration findConfigurationByPropKey(@Param("propKey")String propKey);

	@Query(value = "SELECT * FROM config c " + "WHERE c.config_group_id = :groupId", nativeQuery = true)
	List<Configuration> findByGroupId(@Param("groupId") String groupId);

	@Query(value = "SELECT * FROM config " + "WHERE config_group_id = :groupId", nativeQuery = true)
	Page<Configuration> findByGroupIdPage(@Param("groupId") String groupId, Pageable pageable);

	@Query(value = "SELECT * FROM config " + "WHERE ui_consume = :uiConsume", nativeQuery = true)
	List<Configuration> findExposedConfigurations(@Param("uiConsume") String uiConsume);

	@Query(value = "SELECT * FROM config   ORDER BY config.update_dttm DESC LIMIT 1", nativeQuery = true)
	Configuration findLastModifiedConfigurations();
	*/
	
	@Query(value = "SELECT * FROM config_mig " + "WHERE ui_consume = :uiConsume", nativeQuery = true)
	List<MigratedConfiguration> findMigratedExposedConfigurations(@Param("uiConsume") String uiConsume);

}
