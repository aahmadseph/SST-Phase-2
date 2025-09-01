ALTER TABLE `chub_qa`.`config` 
ADD COLUMN `val_type` ENUM('0', '1', '2', '3') NULL COMMENT 'Type of Config property value' AFTER `val`;