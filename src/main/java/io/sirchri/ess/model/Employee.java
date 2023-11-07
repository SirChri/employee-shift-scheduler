package io.sirchri.ess.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "employee")
public class Employee implements Serializable, GenericEntity<Employee>  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "fullname")
    private String fullname;

    @Column(name = "number", nullable = false)
    private String number;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "weekhrs")
    private Double weekhrs;

    @Column(name = "active")
    private Boolean active;

    // Constructors, getters, and setters

    @PrePersist
    @PreUpdate
    private void generateFullname() {
        this.fullname = this.name + " " + this.surname;
    }

    @Override
    public void update(Employee source) {
        this.name = source.getName();
        this.surname = source.getSurname();
        this.number = source.getNumber();
        this.phone = source.getPhone();
        this.email = source.getEmail();
        this.color = source.getColor();
        this.weekhrs = source.getWeekhrs();
        this.active = source.getActive();
    }

    @Override
    public Employee createNewInstance() {
        Employee newInstance = new Employee();
        newInstance.update(this);
        
        return newInstance;
    }
}