/*
 * Copyright (c) 2024 Christian Londero
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package io.sirchri.ess.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.sirchri.ess.model.lookup.Timezone;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "users", 
    uniqueConstraints = { 
      @UniqueConstraint(columnNames = "username"),
      @UniqueConstraint(columnNames = "email") 
    })
public class User implements Serializable, GenericEntity<User> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "password",
            nullable = false)
    private String password;
    
    @Column(name = "username",
            nullable = false,
            unique = true)
    private String username; 
    
    @Column(name = "email",
            nullable = false,
            unique = true)
    private String email; 
    
    @JsonIgnore    
    @JoinColumn(name = "timezone", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Timezone.class)
    private Timezone timezone;

    @JsonProperty("timezone")
    @Column(name = "timezone")
    private String timezoneFk;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(  name = "user_roles", 
          joinColumns = @JoinColumn(name = "user_id"), 
          inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified_at")
    private ZonedDateTime modifiedAt;
    
    public User() {
    }

    @Override
    public void update(User source) {
      if (source.getUsername() != null)
        this.username = source.getUsername();
      
      if (source.getEmail() != null)
        this.email = source.getEmail();
      
      if (source.getTimezone() != null)
        this.timezone = source.getTimezone();
      
      if (source.getTimezoneFk() != null)
        this.timezoneFk = source.getTimezoneFk();
      
      if (source.getPassword() != null)
        this.password = source.getPassword(); 
      
      if (source.getRoles() != null)
        this.roles = source.getRoles();
    }

    @Override
    public User createNewInstance() {
        User newInstance = new User();
        newInstance.update(this);
        
        return newInstance;
    }
}