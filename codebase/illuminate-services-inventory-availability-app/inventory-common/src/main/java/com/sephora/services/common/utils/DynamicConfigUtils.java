/*
 * package com.sephora.services.common.utils;
 * 
 * 
 * import com.fasterxml.jackson.databind.ObjectMapper; import
 * com.sephora.services.common.dynamicconfig.DynamicConfigConstants;
 * 
 * import lombok.extern.log4j.Log4j2;
 * 
 * import java.io.BufferedReader; import java.io.File; import
 * java.io.FileInputStream; import java.io.FileWriter; import
 * java.io.IOException; import java.io.InputStreamReader; import
 * java.util.stream.Collectors;
 * 
 * @Log4j2 public class DynamicConfigUtils {
 * 
 * 
 * public static File storageLocationPath(String folderBaseLocation,String
 * shipNodeKey){ String fileFullPath = folderBaseLocation + File.separator +
 * DynamicConfigConstants.DYNAMIC_CONFIG + File.separator + shipNodeKey; File
 * file = new File(fileFullPath); return file; }
 * 
 * public static String getFileDataAsString(File file) { FileInputStream is =
 * null; try { is = new FileInputStream(file); BufferedReader reader = new
 * BufferedReader(new InputStreamReader(is)); return (String)
 * reader.lines().collect(Collectors.joining(System.lineSeparator())); } catch
 * (Exception e) {
 * log.error("An exception occurred while getting File Data As String cache: {}"
 * , e.getMessage(), e); return null; } finally { if(null != is) try {
 * is.close(); } catch (IOException e) {
 * log.error("An exception occurred while getting File Data As String cache: {}"
 * , e.getMessage(), e); } } }
 * 
 * public static void writeDynamicConfigToFile(ObjectMapper mapper, Object
 * config, File fullFilePath) { FileWriter fileWriter = null; try { String
 * jsonFileData = mapper.writeValueAsString(config); fileWriter = new
 * FileWriter(fullFilePath,false); fileWriter.write(jsonFileData);
 * fileWriter.close(); } catch (Exception e) {
 * log.error("An exception occurred while writing file" + e); } finally {
 * if(null != fileWriter) try { fileWriter.close(); } catch (IOException e) {
 * log.error("An exception occurred while writing file" + e); } } } }
 */