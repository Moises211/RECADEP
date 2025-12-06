package com.RECADEP.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.RECADEP.backend.Entitys.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>{

}
