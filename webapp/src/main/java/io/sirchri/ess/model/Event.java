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
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.sirchri.ess.model.lookup.EventType;
import static io.sirchri.ess.util.EventUtils.eventToRRuleString;
import static io.sirchri.ess.util.EventUtils.eventToVevent;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.Data;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.Uid;
import net.fortuna.ical4j.util.RandomUidGenerator;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Data
@Entity
@Table(name = "event")
public class Event implements Serializable, GenericEntity<Event> {   
    private static final Logger logger = LoggerFactory.getLogger(Event.class);
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;
    
    @JsonProperty("title")
    @Column(name = "title")
    private String title;
    
    @JsonProperty("summary")
    @Column(name = "summary")
    private String summary;

    @JsonProperty("dtstamp")
    @Column(name = "dtstamp", nullable = false)
    private ZonedDateTime dtStamp;

    @JsonProperty("dtstart")
    @Column(name = "dtstart", nullable = false)
    private ZonedDateTime dtStart;

    @JsonProperty("dtend")
    @Column(name = "dtend", nullable = false)
    private ZonedDateTime dtEnd;

    @JsonProperty("ex_dates")
    @Column(name = "ex_dates", columnDefinition="text")
    private String exDates;
    
    @JsonProperty("timezone")
    @Column(name = "timezone")
    private String timezone;
    
    @Column(name = "uid")
    private String uid;

    @JsonProperty("sequence")
    @Column(name = "sequence", nullable = false)
    private Integer sequence;

    @Column(name = "rrule", columnDefinition="text")
    private String rrule;
    
    @Column(name = "recurring")
    private Boolean recurring;

    //TODO: manage this as enum
    @JsonProperty("until_type")
    @Column(name = "until_type")
    private Integer untilType;

    @JsonProperty("until_date")
    @Temporal(TemporalType.DATE)
    @Column(name = "until_date")
    private Date untilDate;

    @JsonProperty("until_occurrences")
    @Column(name = "until_occurrences")
    private Integer untilOccurrences;

    @JsonProperty("interval")
    @Column(name = "interval")
    private Integer interval;

    //TODO: manage this as enum
    @JsonProperty("frequency")
    @Column(name = "frequency")
    private Integer frequency;
    
    @JsonProperty("recurrence_id")
    @Column(name = "recurrence_id")
    private ZonedDateTime recurrenceId;

    @JsonProperty("day")
    @Column(name = "day")
    private List<Integer> byweekday;
    
    @JsonProperty("status")
    @Column(name = "status")
    private String status;

    @JsonProperty("all_day")
    @Column(name = "all_day")
    private Boolean allDay;
    
    @JsonIgnore    
    @JoinColumn(name = "type", insertable = false, updatable = false)
    @ManyToOne(targetEntity = EventType.class)
    private EventType type;

    @JsonProperty("type")
    @Column(name = "type")
    private String typeFk;

    @JsonIgnore    
    @JoinColumn(name = "customer", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Customer.class, fetch = FetchType.LAZY)
    private Customer customer;

    @JsonProperty("customer")
    @Column(name = "customer")
    private Long customerFk;

    @JsonIgnore    
    @JoinColumn(name = "employee", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Employee.class, fetch = FetchType.LAZY)
    private Employee employee;

    @JsonProperty("employee")
    @Column(name = "employee")
    private Long employeeFk;

    @JsonProperty("duration")
    @Column(name = "duration")
    private Duration duration;

    @Column(name = "ical", columnDefinition="text")
    private String ical;

    //@JsonIgnore    
    @JsonIgnoreProperties({"parent"})
    @JsonProperty("parent")
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    @ManyToOne(targetEntity = Event.class)
    private Event parent;

    /*@JsonProperty("parent")
    @Column(name = "parent_id")
    private Long parentFk;*/

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    @JsonProperty("created_at")
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified_at")
    @JsonProperty("modified_at")
    private ZonedDateTime modifiedAt;

    @PrePersist
    private void beforeInsert() {        
        RandomUidGenerator uidGenerator = new RandomUidGenerator();
        Uid uidVal = uidGenerator.generateUid();
        uid = uidVal.getValue();
        
        sequence = 0;
        if (parent != null) {
            sequence = parent.sequence+1;
        }
        
        this.eventToIcal();
    }
    
    @PreUpdate
    private void beforeUpdate() {
        sequence = sequence+1;
        
        this.eventToIcal();
    }
    
    private void eventToIcal() {
        VEvent ve = eventToVevent(this);
        
        rrule = eventToRRuleString(this);
        ical = ve.toString();
    }
    
    @Override
    public void update(Event source) {
        this.title = source.getTitle();
        this.summary = source.getSummary();
        this.timezone = source.getTimezone();
        this.dtStamp = source.getDtStamp();
        this.dtStart = source.getDtStart();
        this.dtEnd = source.getDtEnd();
        this.allDay = source.getAllDay();
        this.customerFk = source.getCustomerFk();
        this.employeeFk = source.getEmployeeFk();
        this.typeFk = source.getTypeFk();
        this.type = source.getType();
        this.duration = source.getDuration();
        this.recurring = source.getRecurring();
        this.interval = source.getInterval();
        this.frequency = source.getFrequency();
        this.exDates = source.getExDates();
        
        if (source.getByweekday() != null)
            this.byweekday = new ArrayList<>(source.getByweekday());
        
        this.untilType = source.getUntilType();
        this.untilDate = source.getUntilDate();
        this.untilOccurrences = source.getUntilOccurrences();
        
        //this.parentFk = source.getParentFk();
        this.employee = source.getEmployee();
        this.customer = source.getCustomer();
        this.parent = source.getParent();
    }

    @Override
    public Event createNewInstance() {
        Event newInstance = new Event();
        newInstance.update(this);
        
        return newInstance;
    }
}