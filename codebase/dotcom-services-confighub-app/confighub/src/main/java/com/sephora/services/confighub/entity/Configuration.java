package com.sephora.services.confighub.entity;


import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "config")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Configuration {

    @Id
    @Column(name = "config_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    private Long configId;

    @Column(name = "prop")
    private String prop;

    @Column(name = "val")
    private String val;
    
    @Column(name = "val_type")
    private String valType;

    @Column(name = "description")
    private String description;

    @Column(name = "config_group_id")
    private String groupId;


    @Column(name = "updated_by")
    private String userId;


    @CreationTimestamp
    @Column(name = "create_dttm")
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "update_dttm")
    private LocalDateTime modifiedDate;

    @Column(name = "ui_consume")
    private String uiConsume;

    @OneToMany (mappedBy = "configuration", cascade = CascadeType.REMOVE)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonIgnore    
    private List<AuditConfiguration> auditLogs;
}
