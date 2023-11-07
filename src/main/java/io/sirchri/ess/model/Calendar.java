package io.sirchri.ess.model;
import lombok.Data;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "calendar")
public class Calendar  implements Serializable, GenericEntity<Calendar> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "all_day")
    private Boolean allDay;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "hours")
    private Double hours;

    @Override
    public void update(Calendar source) {
        this.startDate = source.getStartDate();
        this.endDate = source.getEndDate();
        this.allDay = source.getAllDay();
        this.customer = source.getCustomer();
        this.employee = source.getEmployee();
        this.hours = source.getHours();
    }

    @Override
    public Calendar createNewInstance() {
        Calendar newInstance = new Calendar();
        newInstance.update(this);
        
        return newInstance;
    }
}