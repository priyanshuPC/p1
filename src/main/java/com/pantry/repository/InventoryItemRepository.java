package com.pantry.repository;

import com.pantry.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByCategory(String category);

    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= i.lowStockThreshold")
    List<InventoryItem> findLowStockItems();

    @Query("SELECT i FROM InventoryItem i WHERE i.expiryDate <= :date")
    List<InventoryItem> findExpiringItems(LocalDate date);

    List<InventoryItem> findByNameContainingIgnoreCase(String name);
}