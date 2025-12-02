package com.thera.theratime.service;

import com.thera.theratime.model.Timesheet;
import com.thera.theratime.model.User;
import com.thera.theratime.repository.TimesheetRepository;
import com.thera.theratime.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimesheetService {

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private UserRepository userRepository;

    public Timesheet submitTimesheet(Long userId, Timesheet timesheet) {
        if (timesheet.getHours() > 24) {
            throw new IllegalArgumentException("Cannot log more than 24 hours in a day.");
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        timesheet.setUser(user);
        timesheet.setStatus(Timesheet.Status.PENDING);
        return timesheetRepository.save(timesheet);
    }

    public List<Timesheet> getPendingTimesheets() {
        return timesheetRepository.findByStatus(Timesheet.Status.PENDING);
    }

    public List<Timesheet> getContractorTimesheets(Long userId) {
        return timesheetRepository.findByUserId(userId);
    }

    public Timesheet approveTimesheet(Long id) {
        Timesheet timesheet = timesheetRepository.findById(id).orElseThrow(() -> new RuntimeException("Timesheet not found"));
        timesheet.setStatus(Timesheet.Status.APPROVED);
        return timesheetRepository.save(timesheet);
    }
}
