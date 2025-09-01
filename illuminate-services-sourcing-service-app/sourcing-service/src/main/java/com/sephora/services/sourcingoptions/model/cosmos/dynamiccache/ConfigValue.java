
package com.sephora.services.sourcingoptions.model.cosmos.dynamiccache;

import java.util.List;
import javax.annotation.Generated;


public class ConfigValue {

    private String sellingChannel;
    private List<ZipCodeRange> zipCodeRanges = null;

    public String getSellingChannel() {
        return sellingChannel;
    }

    public void setSellingChannel(String sellingChannel) {
        this.sellingChannel = sellingChannel;
    }

    public List<ZipCodeRange> getZipCodeRanges() {
        return zipCodeRanges;
    }

    public void setZipCodeRanges(List<ZipCodeRange> zipCodeRanges) {
        this.zipCodeRanges = zipCodeRanges;
    }

}
