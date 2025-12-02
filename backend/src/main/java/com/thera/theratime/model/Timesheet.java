package com.thera.theratime.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Timesheet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate date;
    private Double hours;
    
    @Enumerated(EnumType.STRING)
    private Status status;

    private String notes;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}
