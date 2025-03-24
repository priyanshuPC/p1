package com.pantry.repository;

import com.pantry.entity.StockMovement;
import com.pantry.entity.MovementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByItemId(Long itemId);

    List<StockMovement> findByType(MovementType type);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.movementDate BETWEEN :startDate AND :endDate")
    List<StockMovement> findByMovementDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.itemId = :itemId AND sm.movementDate BETWEEN :startDate AND :endDate")
    List<StockMovement> findByItemIdAndMovementDateBetween(Long itemId, LocalDateTime startDate, LocalDateTime endDate);
}