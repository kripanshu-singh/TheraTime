package com.thera.theratime.controller;

import com.thera.theratime.model.Timesheet;
import com.thera.theratime.service.TimesheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timesheets")
public class TimesheetController {

    @Autowired
    private TimesheetService timesheetService;

    @PostMapping("/submit/{userId}")
    public Timesheet submit(@PathVariable Long userId, @RequestBody Timesheet timesheet) {
        return timesheetService.submitTimesheet(userId, timesheet);
    }

    @GetMapping("/pending")
    public List<Timesheet> getPending() {
        return timesheetService.getPendingTimesheets();
    }

    @GetMapping("/user/{userId}")
    public List<Timesheet> getUserTimesheets(@PathVariable Long userId) {
        return timesheetService.getContractorTimesheets(userId);
    }

    @PostMapping("/approve/{id}")
    public Timesheet approve(@PathVariable Long id) {
        return timesheetService.approveTimesheet(id);
    }
}
