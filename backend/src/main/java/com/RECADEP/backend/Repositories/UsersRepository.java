package com.RECADEP.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.RECADEP.backend.Entitys.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long>{

    Users findByEmail(String email);
}
