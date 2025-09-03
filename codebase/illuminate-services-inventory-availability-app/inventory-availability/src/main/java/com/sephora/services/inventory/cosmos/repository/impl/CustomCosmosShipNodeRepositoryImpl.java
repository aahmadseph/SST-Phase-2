///*
// * This software is the confidential and proprietary information of
// * sephora.com and may not be used, reproduced, modified, distributed,
// * publicly displayed or otherwise disclosed without the express written
// * consent of sephora.com.
// *
// * This software is a work of authorship by sephora.com and protected by
// * the copyright laws of the United States and foreign jurisdictions.
// *
// * Copyright 2020 sephora.com, Inc. All rights reserved.
// */
//
///*
// *  This software is the confidential and proprietary information of
// * sephora.com and may not be used, reproduced, modified, distributed,
// * publicly displayed or otherwise disclosed without the express written
// *  consent of sephora.com.
// *
// * This software is a work of authorship by sephora.com and protected by
// * the copyright laws of the United States and foreign jurisdictions.
// *
// *  Copyright  2019 sephora.com, Inc. All rights reserved.
// *
// */
//
//package com.sephora.services.inventory.cosmos.repository.impl;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
//import com.sephora.platform.database.cosmosdb.repository.support.QuerySupportedCosmosRepository;
//import com.sephora.services.inventory.cosmos.repository.CustomCosmosShipNodeRepository;
//import com.sephora.services.inventory.model.cosmos.doc.ShipNode;
//
///**
// * @author Vitaliy Oleksiyenko
// */
//public class CustomCosmosShipNodeRepositoryImpl extends QuerySupportedCosmosRepository<ShipNode, String>
//        implements CustomCosmosShipNodeRepository {
//
//    public CustomCosmosShipNodeRepositoryImpl(@Autowired CustomCosmosTemplate cosmosTemplate) {
//        super(cosmosTemplate, ShipNode.class);
//    }
//
//    @Override
//    public ShipNode upsertWithTrigger(ShipNode entity) {
//        return null;
//    }
//
//}
