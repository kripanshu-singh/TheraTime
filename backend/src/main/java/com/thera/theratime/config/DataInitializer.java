package com.thera.theratime.config;

import com.thera.theratime.model.User;
import com.thera.theratime.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User contractor = new User();
                contractor.setName("Kripanshu Singh");
                contractor.setEmail("kripanshu@example.com");
                contractor.setRole(User.Role.CONTRACTOR);
                contractor.setRate(65.0);
                userRepository.save(contractor);

                User manager = new User();
                manager.setName("Akhil");
                manager.setEmail("akhil@getthera.com");
                manager.setRole(User.Role.MANAGER);
                manager.setRate(0.0);
                userRepository.save(manager);
                
                System.out.println("Data initialized: Contractor (kripanshu@example.com) and Manager (akhil@getthera.com)");
            }
        };
    }
}
