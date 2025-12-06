package com.RECADEP.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.RECADEP.backend.Entitys.User;

public interface UserRepository  extends JpaRepository<User, Long>{

}
