package com.RECADEP.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.RECADEP.backend.Entitys.Rent;

@Repository
public interface RentRepository extends JpaRepository<Rent, Long>{

}
