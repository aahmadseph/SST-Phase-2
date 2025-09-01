package com.sephora.services.sourcingoptions.service.impl;

import static com.sephora.services.sourcingoptions.SourcingOptionConstants.*;
import static com.sephora.services.sourcingoptions.service.impl.ShipNodeServiceImpl.SEPARATOR;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.sephora.services.sourcingoptions.config.LocationPrioritiesConfig;
import com.sephora.services.sourcingoptions.model.dto.zonemap.ZoneMapMapperContext;
import com.sephora.services.sourcingoptions.service.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.azure.documentdb.DocumentClientException;
import com.microsoft.azure.documentdb.bulkexecutor.BulkImportResponse;
import com.microsoft.azure.documentdb.bulkexecutor.DocumentBulkExecutor;
import com.sephora.services.sourcingoptions.exception.NotFoundException;
import com.sephora.services.sourcingoptions.exception.SourcingItemsServiceException;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.exception.ZoneMapCsvValidationException;
import com.sephora.services.sourcingoptions.model.BatchOperationResultBean;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.model.cosmos.TempZoneMap;
import com.sephora.services.sourcingoptions.model.cosmos.ZipCodeDetails;
import com.sephora.services.sourcingoptions.model.cosmos.ZoneMap;
import com.sephora.services.sourcingoptions.repository.cosmos.TempZoneMapRepository;
import com.sephora.services.sourcingoptions.util.SourcingUtils;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class ZoneMapCsvUploadServiceImpl implements ZoneMapCsvUploadService {
	
	public static final String SHIP_NODE_NOT_FOUND_ERROR = "shipNode.notFound";
	public static final String UPLOADED_ZONE_MAPPING_NOT_FOUND = "uploadZoneMapping.zoneMaps.notFound";
	public static final String UPLOADED_ZONE_MAPPING_INVALID_DC = "uploadZoneMapping.zoneMaps.invalid.dc";
	public static final String UPLOADED_ZONE_MAPPING_INVALID_ZONE_OR_ZIPCODE = "uploadZoneMapping.zoneMaps.invalid.zipcode.zone";
	public static final String UPLOADED_ZONE_MAPPING_INVALID_ZONE_OR_ZIPCODE_CA = "uploadZoneMapping.zoneMaps.invalid.zipcode.zone.ca";
	public static final String UPLOADED_ZONE_MAPPING_INVALID_HEADER = "uploadZoneMapping.zoneMaps.invalid.header";
	public static final String UPLOADED_ZONE_MAPPING_INVALID_HEADER_CA = "uploadZoneMapping.zoneMaps.invalid.header_ca";
	public static final String UPLOADED_ZONE_MAPPING_INVALID_EOD = "uploadZoneMapping.zoneMaps.invalid.eod";
	
	public static final String POROCESS_ZONE_MAPPING_NOT_FOUND = "processZoneMapping.zoneMaps.notFound";

	@Autowired
	private ObjectMapper mapper;

	@Autowired(required = false)
	private DocumentBulkExecutor zoneMapBulkExecutor;
	
	@Autowired
	private ShipNodeService shipNodeService;
	
	private Set<String> shipNodes;
	
	@Value("${sourcing.options.zone-map.mail.enabled}")
	private boolean mailEnabled;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired(required = false)
	TempZoneMapRepository tempZoneMapRepository;

	@Autowired
	SourcingHubZoneMapService sourcingHubZoneMapService;

	@Autowired
	LocationPrioritiesConfig locationPrioritiesConfig;
	
	@Value("${sourcing.options.availabilityhub.redisCache.useCache}")
	private boolean useCache;

	@Autowired
	ShipNodeCacheService shipNodeCacheService;

	@Autowired
	LocationPrioritiesService locationPrioritiesService;

	@Override
	public void uploadCsvZoneMapsForSourcingHub(EnterpriseCodeEnum enterpriseCode, MultipartFile inputFile, Boolean publishExternally) throws SourcingServiceException {
		if(useCache) {
			shipNodes = new HashSet<>(shipNodeCacheService.getShipNodeIds(enterpriseCode.toString()));
		} else {
			shipNodes = shipNodeService.findAllShipNodeByEnterpriseCode(enterpriseCode).stream()
					.map(ShipNode::getId)
					.collect(Collectors.toSet());
		}

		List<ZipCodeDetails> zoneMapDocuments = validateZoneMapsCvsFileForSourcingHub(enterpriseCode, inputFile);
		if (publishExternally) {
			log.info("publishExternally flag is enabled so sending the zone mapping to Yantriks.");
			sourcingHubZoneMapService.save(zoneMapDocuments, enterpriseCode.toValue());
		}
		if(mailEnabled) {
			emailService.sendZoneMapUploadConfirmationMail(inputFile.getOriginalFilename());
		}

		// Save the zone map in azure table storage and redis cache.
		if (Boolean.TRUE.equals(locationPrioritiesConfig.getIsLocationsByPriorities())) {
			locationPrioritiesService.persistLocationPriorities(zoneMapDocuments, enterpriseCode);
		}
	}

	private List<ZipCodeDetails> validateZoneMapsCvsFileForSourcingHub(EnterpriseCodeEnum enterpriseCode, MultipartFile inputFile) throws SourcingServiceException {
		List<ZipCodeDetails> zoneMaps = new ArrayList<ZipCodeDetails>();
		BufferedReader in = null;
		try {
			in = new BufferedReader(new InputStreamReader(inputFile.getInputStream()));
			String data = null;
			boolean firstLine = true;
			boolean lastLine = false;
			while ((data = in.readLine()) != null) {
				//To check is there any data after EndOfRecords
				if(lastLine && !data.trim().isEmpty()) {
					lastLine = false;
					break;
				}
				String[] lineCols = data.split(COMMA);

				//Validate header
				if (firstLine) {
					if (enterpriseCode == EnterpriseCodeEnum.SEPHORAUS) {
						if (validateZoneMapsCsvHeaderUs(lineCols)) {
							firstLine = false;
							continue;
						} else {
							log.error("Validation failed for document header during uploading zone maps cvs");
							throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_HEADER, "");
						}
					} else if(enterpriseCode == EnterpriseCodeEnum.SEPHORACA) {
						if(validateZoneMapsCsvHeaderCa(lineCols)) {
							firstLine = false;
							continue;
						} else {
							log.error("Validation failed for document header during uploading zone maps cvs");
							throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_HEADER_CA, "");
						}
					}
				} else if (isLastLine(lineCols)) {
					lastLine = true;
				} else {
					//Validate and parse each line
					if (enterpriseCode == EnterpriseCodeEnum.SEPHORAUS) {
						zoneMaps.add(validateZoneMapsCvsLineUsForSourcingHub(data, lineCols, inputFile.getOriginalFilename()));
					} else if(enterpriseCode == EnterpriseCodeEnum.SEPHORACA) {
						zoneMaps.add(validateZoneMapsCvsLineCaForSourcingHub(data, lineCols, inputFile.getOriginalFilename()));
					}
				}
			}
			if(!lastLine) {
				log.error("Validation failed end of document during uploading zone maps cvs");
				throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_EOD, "");
			}

		} catch(NotFoundException e) {
			throw e;
		} catch(ZoneMapCsvValidationException e) {
			throw e;
		} catch (Exception e) {
			throw new SourcingServiceException(e);
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return zoneMaps;

	}

	private ZipCodeDetails validateZoneMapsCvsLineCaForSourcingHub(String data, String[] lineColus, String originalFilename) throws Exception {
		try {
			if (lineColus != null
					&& ZONE.equals(lineColus[0])
					&& ZIP_CODE_LENGTH == lineColus[1].length()
					&& ZIP_CODE_LENGTH == lineColus[2].length()) {
				List<String> priority = new ArrayList<String>();
				//validate and parse priorities, column 3 to 5 (Preferred DC columns)
				for (int i = 3; i < lineColus.length - 1; i++) {
					if (lineColus[i].trim().isEmpty()) {
						continue;
					} else if (lineColus[i].length() == DC_NUMBER_LENGTH) {
						if(shipNodes.contains(lineColus[i].trim())) {
							priority.add(lineColus[i]);
						} else {
							log.error("Unable to find shipNodes during uploading zone maps cvs: {}", data);
							throw new NotFoundException(UPLOADED_ZONE_MAPPING_NOT_FOUND, data);
						}
					} else {
						log.error("Validation failed for for DC during uploading zone maps cvs, length must be 4: {}", data);
						throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_DC, data);
					}
				}


				String fromZipCode = lineColus[1];
				String toZipCode = lineColus[2];
				String state = lineColus[lineColus.length - 1];
				ZipCodeDetails.ZipCodeDetailsBuilder zipCodeDetailsBuilder = ZipCodeDetails.builder();


				zipCodeDetailsBuilder.createdAt(SourcingUtils.currentPSTDateTime());
				zipCodeDetailsBuilder.fromZipCode(fromZipCode);
				zipCodeDetailsBuilder.toZipCode(toZipCode);
				zipCodeDetailsBuilder.priority(priority);
				zipCodeDetailsBuilder.state(state);
				return zipCodeDetailsBuilder.build();
			} else {
				log.error("Validation failed for number of column or first colum or zipcode during uploading zone maps cvs, length must be 4: {}",
						data);
				throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_ZONE_OR_ZIPCODE_CA, data);
			}
		} catch(Exception ex) {
			throw ex;
		}
	}

	private ZipCodeDetails validateZoneMapsCvsLineUsForSourcingHub(String data, String[] lineColus, String originalFilename) throws Exception {
		try {
			//Validate column count, first column and second column
			if (lineColus != null
					&& ZONE.equals(lineColus[0])
					&& ZIP_CODE_LENGTH == lineColus[1].length()) {
				List<String> priority = new ArrayList<String>();
				//validate and parse priorities, column 2 to 6
				for (int i = 2; i < lineColus.length - 1; i++) {
					if (lineColus[i].trim().isEmpty()) {
						continue;
					} else if (lineColus[i].length() == DC_NUMBER_LENGTH) {
						if(shipNodes.contains(lineColus[i].trim())) {
							priority.add(lineColus[i]);
						} else {
							log.error("Unable to find shipNodes during uploading zone maps cvs: {}", data);
							throw new NotFoundException(UPLOADED_ZONE_MAPPING_NOT_FOUND, data);
						}
					} else {
						log.error("Validation failed for for DC during uploading zone maps cvs, length must be 4: {}", data);
						throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_DC, data);
					}
				}

				String fromZipCode = lineColus[1];
				String toZipCode = lineColus[1];
				String state = lineColus[lineColus.length - 1];
				ZipCodeDetails.ZipCodeDetailsBuilder zipCodeDetailsBuilder = ZipCodeDetails.builder();

				zipCodeDetailsBuilder.createdAt(SourcingUtils.currentPSTDateTime());
				zipCodeDetailsBuilder.fromZipCode(fromZipCode);
				zipCodeDetailsBuilder.toZipCode(toZipCode);
				zipCodeDetailsBuilder.priority(priority);
				zipCodeDetailsBuilder.state(state);
				return zipCodeDetailsBuilder.build();

			} else {
				log.error("Validation failed for number of column or first colum or zipcode during uploading zone maps cvs, length must be 4: {}",
						data);
				throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_ZONE_OR_ZIPCODE, data);
			}
		}catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void uploadCvsZoneMaps(EnterpriseCodeEnum enterpriseCode, MultipartFile inputFile)
			throws SourcingServiceException {
		try {
			if(useCache) {
				shipNodes = new HashSet<>(shipNodeCacheService.getShipNodeIds(enterpriseCode.toString()));
			} else {
				shipNodes = shipNodeService.findAllShipNodeByEnterpriseCode(enterpriseCode).stream()
						.map(ShipNode::getId)
						.collect(Collectors.toSet());
			}			
			
			List<ZipCodeDetails> zoneMapDocuments = validateZoneMapsCvsFile(enterpriseCode, inputFile);
			TempZoneMap.TempZoneMapBuilder tempZoneMapBuilder = TempZoneMap.builder();
			
			List<TempZoneMap> openZoneMap = tempZoneMapRepository.findByEnterpriseCodeAndStatus(enterpriseCode.toValue(), "OPEN");
			if(null != openZoneMap && !openZoneMap.isEmpty()) {
				log.debug("Updating zone map file for enterpriseCode: {}", enterpriseCode.toValue());
				tempZoneMapBuilder.id(openZoneMap.get(0).getId());
			} else {
				log.debug("Scheduling new zone map file for enterpriseCode: {}", enterpriseCode.toValue());
				tempZoneMapBuilder.id(String.valueOf(System.currentTimeMillis()));
			}
			
			if (enterpriseCode == EnterpriseCodeEnum.SEPHORAUS) { 
				tempZoneMapBuilder.enterpriseCode(EnterpriseCodeEnum.SEPHORAUS.toValue());
			}  else if(enterpriseCode == EnterpriseCodeEnum.SEPHORACA) {
				tempZoneMapBuilder.enterpriseCode(EnterpriseCodeEnum.SEPHORACA.toValue());
			}
			tempZoneMapBuilder.reference(inputFile.getOriginalFilename());
			tempZoneMapBuilder.status("OPEN");
			tempZoneMapBuilder.zipCodeDetails(zoneMapDocuments);
			
			tempZoneMapRepository.save(tempZoneMapBuilder.build());
			
			if(mailEnabled) {
				emailService.sendZoneMapUploadConfirmationMail(inputFile.getOriginalFilename());
			}
		
		} catch(SourcingServiceException | ZoneMapCsvValidationException | NotFoundException  e) {
			log.error("An exception occured while uplaoding zone map csv", e);
		 	throw e;
	    } catch(Exception e) {
			log.error("An exception occured while uplaoding zone map csv", e);
			throw new SourcingServiceException(e);
		}
	}
	
	@Override
	public BatchOperationResultBean processCvsZoneMaps(EnterpriseCodeEnum enterpriseCode)
			throws SourcingServiceException {
		try {
			List<TempZoneMap> openZoneMap = tempZoneMapRepository
					.findByEnterpriseCodeAndStatus(enterpriseCode.toValue(), "OPEN");
			List<String> zoneMapDocuments = new ArrayList<String>();
			TempZoneMap tempZoneMap = null;
			if (null != openZoneMap && openZoneMap.size() == 1) {
				tempZoneMap = openZoneMap.get(0);
				
				for (ZipCodeDetails zipCodeDetails : tempZoneMap.getZipCodeDetails()) {
					ZoneMap.ZoneMapBuilder zoneMapBuilder = ZoneMap.builder();

					zoneMapBuilder.id(tempZoneMap.getEnterpriseCode().concat(ZONE_MAP_ID_SEPARATOR)
							.concat(zipCodeDetails.getFromZipCode()).concat(ZONE_MAP_ID_SEPARATOR)
							.concat(zipCodeDetails.getToZipCode()));

					zoneMapBuilder.fromZipCode(zipCodeDetails.getFromZipCode());
					zoneMapBuilder.toZipCode(zipCodeDetails.getToZipCode());
					zoneMapBuilder.enterpriseCode(tempZoneMap.getEnterpriseCode());
					zoneMapBuilder.createdAt(zipCodeDetails.getCreatedAt());
					zoneMapBuilder.reference(tempZoneMap.getReference());
					zoneMapBuilder.priority(zipCodeDetails.getPriority());
					zoneMapDocuments.add(mapper.writeValueAsString(zoneMapBuilder.build()));
				}
				
			} else {
				log.warn("No scheduled document found for enterpriseCode: {}", enterpriseCode.toValue());
				throw new NotFoundException(POROCESS_ZONE_MAPPING_NOT_FOUND, enterpriseCode.toValue());
			}
			
			log.debug("Begin bulk import of updated Zone Mappings {}", zoneMapDocuments.size());
			BulkImportResponse importResponse = zoneMapBulkExecutor.importAll(zoneMapDocuments, true, true, null);
			
			if(null != importResponse) {
				log.info("Imported {} documents; consumed RU: {}; time taken: {}.",
						importResponse.getNumberOfDocumentsImported(), importResponse.getTotalRequestUnitsConsumed(),
						importResponse.getTotalTimeTaken());
	
				if (importResponse.getNumberOfDocumentsImported() < zoneMapDocuments.size()) {
					log.error("Bulk import error. BadInputDocuments: {}; import error: {}", importResponse.getBadInputDocuments(), importResponse.getErrors());
					importResponse.getFailedImports().forEach(fi -> {
						log.error("DocumentsFailedToImport: {}; BulkImportFailureException: {}",
								fi.getDocumentsFailedToImport(), fi.getBulkImportFailureException());
					});
				}
				
				if(mailEnabled) {
					emailService.sendZoneMapProcessConfirmationMail(enterpriseCode.toValue());
					log.debug("Send confirmation mail for process zone map");
				}
				
				if(null != tempZoneMap) {
					tempZoneMap.setStatus("CLOSE");
					tempZoneMapRepository.save(tempZoneMap);
				}
				
				return BatchOperationResultBean.builder()
	                    .recordCount(zoneMapDocuments.size())
	                    .processedRecordCount(importResponse.getNumberOfDocumentsImported())
	                    .failedRecordCount(importResponse.getBadInputDocuments().size() + importResponse.getFailedImports().size())
	                    .build();
			}
		}catch(NotFoundException ex) {
			log.error("An exception occured while processing zone map", ex);
			throw ex;
		}catch (Exception ex) {
			log.error("An exception occured while processing zone map", ex);
			throw new SourcingServiceException(ex);
		}
		return null;
	}

	private List<ZipCodeDetails> validateZoneMapsCvsFile(EnterpriseCodeEnum enterpriseCode, MultipartFile inputFile)
			throws SourcingServiceException {
		List<ZipCodeDetails> zoneMaps = new ArrayList<ZipCodeDetails>();
		BufferedReader in = null;
		try {
			in = new BufferedReader(new InputStreamReader(inputFile.getInputStream()));
			String data = null;
			boolean firstLine = true;
			boolean lastLine = false;
			while ((data = in.readLine()) != null) {
				//To check is there any data after EndOfRecords
				if(lastLine && !data.trim().isEmpty()) {
					lastLine = false;
					break;
				}
				String[] lineCols = data.split(COMMA);
				
				//Validate header
				if (firstLine) {
					if (enterpriseCode == EnterpriseCodeEnum.SEPHORAUS) {
						if (validateZoneMapsCsvHeaderUs(lineCols)) {
							firstLine = false;
							continue;
						} else {
							log.error("Validation failed for document header during uploading zone maps cvs");
							throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_HEADER, "");
						}
					} else if(enterpriseCode == EnterpriseCodeEnum.SEPHORACA) {
						if(validateZoneMapsCsvHeaderCa(lineCols)) {
							firstLine = false;
							continue;
						} else {
							log.error("Validation failed for document header during uploading zone maps cvs");
							throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_HEADER_CA, "");
						}
					}
				} else if (isLastLine(lineCols)) {
					lastLine = true;
				} else {
					//Validate and parse each line
					if (enterpriseCode == EnterpriseCodeEnum.SEPHORAUS) {
						zoneMaps.add(validateZoneMapsCvsLineUs(data, lineCols, inputFile.getOriginalFilename()));
					} else if(enterpriseCode == EnterpriseCodeEnum.SEPHORACA) {
						zoneMaps.add(validateZoneMapsCvsLineCa(data, lineCols, inputFile.getOriginalFilename()));
					}
				}
			}
			if(!lastLine) {
				log.error("Validation failed end of document during uploading zone maps cvs");
				throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_EOD, "");
			}
			
		} catch(NotFoundException e) {
			throw e;
		} catch(ZoneMapCsvValidationException e) {
		 	throw e;
	    } catch (Exception e) {
			throw new SourcingServiceException(e);
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return zoneMaps;
	}

	private ZipCodeDetails validateZoneMapsCvsLineUs(String data, String[] lineColus, String reference)
			throws Exception {
		try {
			//Validate column count, first column and second column
			if (lineColus != null
					&& ZONE.equals(lineColus[0])
					&& ZIP_CODE_LENGTH == lineColus[1].length()) {
				List<String> priority = new ArrayList<String>();
				//validate and parse priorities, column 2 to 6 
				for (int i = 2; i < lineColus.length - 1; i++) {
					if (lineColus[i].trim().isEmpty()) {
						continue;
					} else if (lineColus[i].length() == DC_NUMBER_LENGTH) {
						if(shipNodes.contains(lineColus[i].trim())) {
							priority.add(lineColus[i]);
						} else {
							log.error("Unable to find shipNodes during uploading zone maps cvs: {}", data);
					        throw new NotFoundException(UPLOADED_ZONE_MAPPING_NOT_FOUND, data);
						}
					} else {
						log.error("Validation failed for for DC during uploading zone maps cvs, length must be 4: {}", data);
				        throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_DC, data);
					}
				}
				
				String fromZipCode = lineColus[1].concat(US_FROM_ZIP_CODE_SUFFIX);
				String toZipCode = lineColus[1].concat(US_TO_ZIP_CODE_SUFFIX);
				String state = lineColus[lineColus.length - 1];
				ZipCodeDetails.ZipCodeDetailsBuilder zipCodeDetailsBuilder = ZipCodeDetails.builder();
				
				zipCodeDetailsBuilder.createdAt(SourcingUtils.currentPSTDateTime());
				zipCodeDetailsBuilder.fromZipCode(fromZipCode);
				zipCodeDetailsBuilder.toZipCode(toZipCode);
				zipCodeDetailsBuilder.priority(priority);
				zipCodeDetailsBuilder.state(state);
				return zipCodeDetailsBuilder.build();
				
			} else {
				log.error("Validation failed for number of column or first colum or zipcode during uploading zone maps cvs, length must be 4: {}",
						data);
		        throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_ZONE_OR_ZIPCODE, data);
			}
		}catch (Exception e) {
			throw e;
		}
	}

	private boolean isLastLine(String[] lineCols) {
		if (lineCols != null && lineCols.length == 1) {
			if( END_OF_RECORDS.equals(lineCols[0].trim())) {
				return true;
			} else {
				log.error("Validation failed end of document during uploading zone maps cvs");
				throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_EOD, "");
			}
		} else {
			return false;
		}
	}

	private boolean validateZoneMapsCsvHeaderUs(String[] headerCols) {
		boolean isValid = headerCols != null
				&& headerCols[0].equals(RECORD)
				&& headerCols[1].equals(ZIPCODE)
				&& headerCols[headerCols.length - 1].equals(STATE);
		for (int i = 2, j = 1; i < headerCols.length - 1; i++, j++) {
			isValid = headerCols[i].equals(PREFFERED_DC + j);
		}
		return isValid;
	}
	
	private ZipCodeDetails validateZoneMapsCvsLineCa(String data, String[] lineColus, String reference) throws Exception {
		try {
			if (lineColus != null
					&& ZONE.equals(lineColus[0])
					&& ZIP_CODE_LENGTH == lineColus[1].length()
					&& ZIP_CODE_LENGTH == lineColus[2].length()) {
				List<String> priority = new ArrayList<String>();
				//validate and parse priorities, column 3 to 5 (Preferred DC columns)
				for (int i = 3; i < lineColus.length - 1; i++) {
					if (lineColus[i].trim().isEmpty()) {
						continue;
					} else if (lineColus[i].length() == DC_NUMBER_LENGTH) {
						if(shipNodes.contains(lineColus[i].trim())) {
							priority.add(lineColus[i]);
						} else {
							log.error("Unable to find shipNodes during uploading zone maps cvs: {}", data);
					        throw new NotFoundException(UPLOADED_ZONE_MAPPING_NOT_FOUND, data);
						}
					} else {
						log.error("Validation failed for for DC during uploading zone maps cvs, length must be 4: {}", data);
				        throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_DC, data);
					}
				}
				
				
				String fromZipCode = lineColus[1];
				String toZipCode = lineColus[2].concat(CA_TO_ZIP_CODE_SUFFIX);
				String state = lineColus[lineColus.length - 1];
				ZipCodeDetails.ZipCodeDetailsBuilder zipCodeDetailsBuilder = ZipCodeDetails.builder();
				
				
				zipCodeDetailsBuilder.createdAt(SourcingUtils.currentPSTDateTime());
				zipCodeDetailsBuilder.fromZipCode(fromZipCode);
				zipCodeDetailsBuilder.toZipCode(toZipCode);
				zipCodeDetailsBuilder.priority(priority);
				zipCodeDetailsBuilder.state(state);
				return zipCodeDetailsBuilder.build();
			} else {
				log.error("Validation failed for number of column or first colum or zipcode during uploading zone maps cvs, length must be 4: {}",
						data);
		        throw new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_ZONE_OR_ZIPCODE_CA, data);
			}
		} catch(Exception ex) {
			throw ex;
		}
	}
	
	private boolean validateZoneMapsCsvHeaderCa(String[] headerCols) {
		boolean isValid = false;
		if (headerCols != null && headerCols.length > 4) {
			isValid =  headerCols[0].equals(RECORD)
					&& headerCols[1].equals(FSA_START)
					&& headerCols[2].equals(FSA_END)
					&& headerCols[headerCols.length - 1].equals(PROVINCE);

			// SC-26086: Validating  Preferred DC header
			for (int i = 3, j = 1; i < headerCols.length -1; i++, j++) {
				isValid = isValid && headerCols[i].equals(PREFFERED_DC + j);
			}
		}
		return isValid;
	}
}
