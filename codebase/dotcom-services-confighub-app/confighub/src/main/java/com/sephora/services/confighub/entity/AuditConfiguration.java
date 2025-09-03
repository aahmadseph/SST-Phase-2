package com.sephora.services.confighub.entity;


import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "config_audit")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AuditConfiguration {

    @Id
    @Column(name = "config_audit_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    private Long configAuditId;
    
    @Column(name = "updated_by")
    private String userId;
  
    @Column(name = "old_val")
    private String val;

    @Column(name = "config_id")
    private String configId;

    @CreationTimestamp
    @Column(name = "create_dttm")
    private LocalDateTime createdDate;

    @ManyToOne
    @JoinColumn(name = "config_id", insertable = false, updatable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonIgnore
    private Configuration configuration;
}
