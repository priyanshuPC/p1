package com.pantry.repository;

import com.pantry.entity.StockMovement;
import com.pantry.entity.MovementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByInventoryItemId(Long inventoryItemId);

    List<StockMovement> findByMovementType(MovementType type);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.movementDate BETWEEN :startDate AND :endDate")
    List<StockMovement> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.inventoryItem.id = :itemId AND sm.movementDate BETWEEN :startDate AND :endDate")
    List<StockMovement> findByItemAndDateRange(Long itemId, LocalDateTime startDate, LocalDateTime endDate);
}