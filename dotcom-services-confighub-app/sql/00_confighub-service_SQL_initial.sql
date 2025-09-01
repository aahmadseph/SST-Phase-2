
 CREATE TABLE `config_group` (
  `config_group_id` TINYINT AUTO_INCREMENT COMMENT 'The configuration group id',
  `group_name` varchar(256) NOT NULL COMMENT 'The configuration group name', 
  `create_dttm` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT 'Creation date and time',
  `update_dttm` DATETIME ON UPDATE CURRENT_TIMESTAMP NULL COMMENT 'Updated date and time',  
  PRIMARY KEY (`config_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Master table for configuration groups';

 CREATE TABLE `config` (
  `config_id` MEDIUMINT AUTO_INCREMENT COMMENT 'The configuration id', 
  `prop` varchar(256) NOT NULL COMMENT 'The property key',
  `val` MEDIUMTEXT NOT NULL COMMENT 'The property value',
  `description` TEXT NULL COMMENT 'Description of the property',
  `application`  ENUM ('GLOBAL') NOT NULL COMMENT 'The application to which property belong',
  `profile` ENUM ('DEFAULT') NOT NULL COMMENT 'The profile related to property',
  `label` ENUM ('MASTER') NOT NULL COMMENT 'The label related to property',
  `config_group_id` TINYINT NOT NULL COMMENT 'The configuration id',
  `updated_by` varchar(256) NULL COMMENT 'The user who updated the property', 
  `create_dttm` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT 'Creation date and time',
  `update_dttm` DATETIME ON UPDATE CURRENT_TIMESTAMP NULL COMMENT 'Updated date and time',
  PRIMARY KEY (`config_id`),
  KEY `fk_config_group_id_idx` (`config_group_id`),
  CONSTRAINT `fk_config_group_id` FOREIGN KEY (`config_group_id`) REFERENCES `config_group` (`config_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Table for storing business managed configuration properties';

 CREATE TABLE `config_group_roles` ( 
  `config_group_id` TINYINT NOT NULL COMMENT 'The configuration group id',
  `edit_role` TEXT DEFAULT NULL COMMENT 'List of edit roles',
  `view_role` TEXT DEFAULT NULL COMMENT 'List of view roles',
  `create_dttm` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT 'Creation date and time',
  `update_dttm` DATETIME ON UPDATE CURRENT_TIMESTAMP NULL COMMENT 'Updated date and time',  
  PRIMARY KEY (`config_group_id`),
  CONSTRAINT `fk_config_roles_group_id` FOREIGN KEY (`config_group_id`) REFERENCES `config_group` (`config_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Table describing roles for configuration groups';

 CREATE TABLE `config_audit` (
  `config_audit_id` BIGINT AUTO_INCREMENT COMMENT 'The property key',
  `updated_by` varchar(256) NOT NULL COMMENT 'The user who updated the property',
  `old_val` MEDIUMTEXT NOT NULL COMMENT 'The property value',
  `create_dttm` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT 'Creation date and time',
  `config_id` MEDIUMINT NOT NULL COMMENT 'The configuration id',
  PRIMARY KEY (`config_audit_id`),
  KEY `fk_config_id_idx` (`config_id`),
  CONSTRAINT `fk_config_id` FOREIGN KEY (`config_id`) REFERENCES `config` (`config_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Table for auditing the configuration property changes';
