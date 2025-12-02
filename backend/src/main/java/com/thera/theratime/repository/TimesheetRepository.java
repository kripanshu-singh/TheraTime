package com.thera.theratime.repository;

import com.thera.theratime.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {
    List<Timesheet> findByUserId(Long userId);
    List<Timesheet> findByStatus(Timesheet.Status status);
}
