package com.sephora.services.confighub.mapper;

import org.springframework.stereotype.Component;

import com.sephora.services.confighub.dto.PageDTO;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class PageToPageDTOMapper<T> {

    public PageDTO<T> pageToPageDTO(long totalElements, int totalPages, String lastModifiedUser,
                                    LocalDateTime modifiedDate, List<T> content) {
        PageDTO<T> pageDTO = new PageDTO<>();
        pageDTO.setContent(content);
        pageDTO.setTotalElements(totalElements);
        pageDTO.setTotalPages(totalPages);
        pageDTO.setLastModifiedUser(lastModifiedUser);
        pageDTO.setLastModifiedDateTime(modifiedDate);

        return pageDTO;
    }
}