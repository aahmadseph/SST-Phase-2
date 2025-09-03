/*
 * package com.sephora.services.inventoryavailability.service;
 * 
 * 
 * import
 * com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
 * import com.sephora.platform.cache.service.CacheService; import
 * com.sephora.services.inventoryavailability.AvailabilityConfig; import
 * com.sephora.services.inventoryavailability.TestUtils; import
 * com.sephora.services.inventoryavailability.exception.HoldItemException;
 * import com.sephora.services.inventoryavailability.mapping.ItemHoldMapper;
 * import com.sephora.services.inventoryavailability.model.itemhold.request.
 * ItemHoldUpdateRequestDto; import org.junit.Test; import
 * org.junit.runner.RunWith; import org.mockito.ArgumentMatchers; import
 * org.mockito.Mockito; import
 * org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.boot.autoconfigure.EnableAutoConfiguration; import
 * org.springframework.boot.autoconfigure.gson.GsonAutoConfiguration; import
 * org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
 * import
 * org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
 * import org.springframework.boot.test.context.
 * ConfigFileApplicationContextInitializer; import
 * org.springframework.boot.test.mock.mockito.MockBean; import
 * org.springframework.boot.test.mock.mockito.MockBeans; import
 * org.springframework.context.annotation.ComponentScan; import
 * org.springframework.test.context.ContextConfiguration; import
 * org.springframework.test.context.TestPropertySource; import
 * org.springframework.test.context.junit4.SpringRunner;
 * 
 * @RunWith(SpringRunner.class)
 * 
 * @EnableAutoConfiguration(exclude = { DataSourceAutoConfiguration.class,
 * HibernateJpaAutoConfiguration.class, GsonAutoConfiguration.class,
 * CosmosAutoConfiguration.class})
 * 
 * @ComponentScan(basePackages = {
 * "com.sephora.services.common.inventory.validators" }, basePackageClasses = {
 * ItemHoldMapper.class })
 * 
 * @ContextConfiguration(classes = { AvailabilityConfig.class }, initializers =
 * ConfigFileApplicationContextInitializer.class)
 * 
 * @TestPropertySource("classpath:application-test.yaml")
 * 
 * @MockBeans(value = { }) public class ItemHoldServiceTests {
 * 
 * @MockBean private CacheService cacheService;
 * 
 * @Autowired HoldItemService itemHoldService;
 * 
 * @Before public void before(){ cacheService. }
 * 
 * @Test public void testValidRequest() throws HoldItemException {
 * ItemHoldUpdateRequestDto itemHoldRequest =
 * TestUtils.buildItemHoldUpdateRequestDtoFromConstant();
 * itemHoldService.updateHoldItemStatus(itemHoldRequest);
 * Mockito.verify(cacheService, Mockito.times(1)).putCacheItems(
 * ArgumentMatchers.any(), ArgumentMatchers.any()); }
 * 
 * @Test(expected = HoldItemException.class) public void testInvalidRequest()
 * throws HoldItemException { ItemHoldUpdateRequestDto itemHoldRequest =
 * TestUtils.buildItemHoldUpdateRequestDtoFromConstant();
 * itemHoldRequest.getProducts().get(0).setProductId(null);
 * itemHoldService.updateHoldItemStatus(itemHoldRequest); }
 * 
 * @Test(expected = HoldItemException.class) public void
 * testCacheSubmissionError() throws HoldItemException { Mockito.doThrow(new
 * NullPointerException()).when(cacheService).putCacheItems(ArgumentMatchers.any
 * (), ArgumentMatchers.any()); ItemHoldUpdateRequestDto itemHoldRequest =
 * TestUtils.buildItemHoldUpdateRequestDtoFromConstant();
 * itemHoldService.updateHoldItemStatus(itemHoldRequest); } }
 */