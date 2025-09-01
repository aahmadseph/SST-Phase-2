
package com.sephora.services.confighub.entity;


import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "config_group")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ConfigurationGroup {

    @Id
    @Column(name = "config_group_id")
    private Long configId;

    @Column(name = "group_name")
    private String groupName;

    @CreationTimestamp
    @Column(name = "create_dttm")
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "update_dttm")
    private LocalDateTime modifiedDate;
}
