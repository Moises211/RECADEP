package com.RECADEP.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.RECADEP.backend.Entitys.Field;
import com.RECADEP.backend.Entitys.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

  @Query("""
      SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END
      FROM Reservation r
      WHERE r.field = :field
        AND r.reservationDate = :date
        AND (
          (:newStartTime < r.endTime AND :newEndTime > r.startTime)
        )
      """)
  boolean existsCollision(
      @Param("field") Field field,
      @Param("date") String reservationDate,
      @Param("newStartTime") String endTime,
      @Param("newEndTime") String startTime);

  @Query("""
        SELECT r FROM Reservation r WHERE r.customer.customerId = :customerId
      """)
  List<Reservation> findByCustomerId(@Param("customerId") Long customerId);
}
