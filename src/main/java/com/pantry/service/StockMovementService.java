package com.pantry.service;

import com.pantry.dto.StockMovementDTO;
import com.pantry.entity.InventoryItem;
import com.pantry.entity.MovementType;
import com.pantry.entity.StockMovement;
import com.pantry.repository.InventoryItemRepository;
import com.pantry.repository.StockMovementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockMovementService {
    private final StockMovementRepository stockMovementRepository;
    private final InventoryItemRepository inventoryItemRepository;

    @Transactional
    public StockMovementDTO createMovement(StockMovementDTO movementDTO) {
        InventoryItem item = inventoryItemRepository.findById(movementDTO.getInventoryItemId())
                .orElseThrow(() -> new EntityNotFoundException("Inventory item not found"));

        StockMovement movement = convertToEntity(movementDTO);
        movement.setInventoryItem(item);

        // Update inventory quantity based on movement type
        updateInventoryQuantity(item, movementDTO.getQuantity(), movementDTO.getType());

        StockMovement savedMovement = stockMovementRepository.save(movement);
        inventoryItemRepository.save(item);

        return convertToDTO(savedMovement);
    }

    public List<StockMovementDTO> getMovementsByItemId(Long itemId) {
        return stockMovementRepository.findByInventoryItemId(itemId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<StockMovementDTO> getMovementsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return stockMovementRepository.findByDateRange(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void updateInventoryQuantity(InventoryItem item, Integer quantity, MovementType type) {
        switch (type) {
            case ADD:
                item.setQuantity(item.getQuantity() + quantity);
                break;
            case REMOVE:
            case USE:
                if (item.getQuantity() < quantity) {
                    throw new IllegalArgumentException("Insufficient stock");
                }
                item.setQuantity(item.getQuantity() - quantity);
                break;
            case ADJUST:
                item.setQuantity(quantity);
                break;
        }
    }

    private StockMovement convertToEntity(StockMovementDTO dto) {
        StockMovement movement = new StockMovement();
        movement.setQuantity(dto.getQuantity());
        movement.setType(dto.getType());
        movement.setNotes(dto.getNotes());
        movement.setMovementDate(LocalDateTime.now());
        return movement;
    }

    private StockMovementDTO convertToDTO(StockMovement movement) {
        StockMovementDTO dto = new StockMovementDTO();
        dto.setId(movement.getId());
        dto.setInventoryItemId(movement.getInventoryItem().getId());
        dto.setQuantity(movement.getQuantity());
        dto.setType(movement.getType());
        dto.setMovementDate(movement.getMovementDate());
        dto.setNotes(movement.getNotes());
        return dto;
    }
}