package com.pantry.service;

import com.pantry.entity.StockMovement;
import com.pantry.entity.MovementType;
import com.pantry.entity.InventoryItem;
import com.pantry.repository.StockMovementRepository;
import com.pantry.repository.InventoryItemRepository;
import com.pantry.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockMovementService {
    private final StockMovementRepository stockMovementRepository;
    private final InventoryItemRepository inventoryItemRepository;

    @Transactional
    public StockMovement createMovement(StockMovement movement) {
        // Validate inventory item exists
        if (!inventoryItemRepository.existsById(movement.getItemId())) {
            throw new EntityNotFoundException("Inventory item not found with id: " + movement.getItemId());
        }

        // Update inventory quantity based on movement type
        InventoryItem item = inventoryItemRepository.findById(movement.getItemId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Inventory item not found with id: " + movement.getItemId()));

        if (movement.getType() == MovementType.IN) {
            item.setQuantity(item.getQuantity() + movement.getQuantity());
        } else if (movement.getType() == MovementType.OUT) {
            if (item.getQuantity() < movement.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for item: " + item.getName());
            }
            item.setQuantity(item.getQuantity() - movement.getQuantity());
        }

        inventoryItemRepository.save(item);
        return stockMovementRepository.save(movement);
    }

    public List<StockMovement> getMovementsByItemId(Long itemId) {
        return stockMovementRepository.findByItemId(itemId);
    }

    public List<StockMovement> getMovementsByType(MovementType type) {
        return stockMovementRepository.findByType(type);
    }

    public List<StockMovement> getMovementsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return stockMovementRepository.findByMovementDateBetween(startDate, endDate);
    }
}