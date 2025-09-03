package com.sephora.services.sourcingoptions.mapper;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
public class ZoneMapMapperTest {

    private ZoneMapMapper mapper = ZoneMapMapper.INSTANCE;

    @Test
    public void shouldConvertPriorityToList() {
        List<String> priority = mapper.convertPriority("1001|0801");

        assertThat(priority)
            .hasSize(2)
            .isSubsetOf("1001", "0801");
    }

    @Test
    public void shouldConvertPriorityToList_withOneValue() {
        List<String> priority = mapper.convertPriority("1001");

        assertThat(priority)
            .hasSize(1)
            .isSubsetOf("1001");
    }

    @Test
    public void whenConvertPriorityToList_withEmptyInput_shouldReturnNull() {
        List<String> priority = mapper.convertPriority("");

        assertThat(priority).isNull();
    }

    @Test
    public void convertPriorityToString() {
        String priority = mapper.convertPriority(asList("1001", "0801"));

        assertThat(priority)
            .isNotNull()
            .isEqualTo("1001|0801");
    }
}
