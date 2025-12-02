package com.thera.theratime.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String name;
    
    @Enumerated(EnumType.STRING)
    private Role role;

    private Double rate; // Hourly rate

    public enum Role {
        CONTRACTOR, MANAGER
    }
}
