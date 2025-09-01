package com.sephora.services.productaggregationservice.productaggregationservice.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ReferenceUpdate {

   String id;

   List<String> names;

   List<ReferenceItem> referenceItems;

}
