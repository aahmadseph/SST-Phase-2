package com.sephora.services.sourcingoptions.mapper;

import com.sephora.platform.common.mapper.BaseMapper;
import com.sephora.services.sourcingoptions.model.cosmos.ZoneMap;
import com.sephora.services.sourcingoptions.model.dto.*;
import org.apache.commons.lang3.StringUtils;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.sephora.services.sourcingoptions.validation.ValidationConstants.NODE_PRIORITY_DELIMITER;
import static com.sephora.services.sourcingoptions.validation.ValidationConstants.NODE_PRIORITY_PIPE_PATTERN;
import static java.util.stream.Collectors.toList;

@Mapper
public interface ZoneMapMapper extends BaseMapper<ZoneMap, ZoneMapDto> {

    ZoneMapMapper INSTANCE = Mappers.getMapper(ZoneMapMapper.class);

    @Override
    @Mapping(target = "nodePriority", source = "priority")
    ZoneMapDto convert(ZoneMap input);

    @Mapping(target = "priority", source = "nodePriority")
    ZoneMap convert(ZoneMappingFilterDto zoneMappingFilterDto);

    @InheritConfiguration
    ZoneMapFullDto convertToFullDto(ZoneMap input);

    default List<ZoneMapFullDto> convertListToFullDto(List<ZoneMap> input) {
        if (input == null) {
            return null;
        }
        return input
                .stream()
                .map(this::convertToFullDto)
                .filter(Objects::nonNull)
                .collect(toList());
    }

    ZoneMap createFrom(ZoneMapsDto zoneMapsDto, ZipCodeRangeDto zipCodeRange, String priority);

    default List<String> convertPriority(String priorities) {
        if (StringUtils.isBlank(priorities)) {
            return null;
        }

        return Stream.of(NODE_PRIORITY_PIPE_PATTERN.split(priorities))
            .collect(Collectors.toList());
    }

    default String convertPriority(List<String> priorities) {
        if (CollectionUtils.isEmpty(priorities)) {
            return null;
        }
        return String.join(NODE_PRIORITY_DELIMITER, priorities);
    }
}
