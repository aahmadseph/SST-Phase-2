package com.sephora.services.confighub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageDTO<T> {

    public PageDTO(Page<T> page){
        this.content = page.getContent();
        this.totalElements = page.getTotalElements();
    }

    private List<T> content;

    private long totalElements;
    private long totalPages;
    private LocalDateTime lastModifiedDateTime;
    private String lastModifiedUser;

}