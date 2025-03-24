package com.pantry.dto;

import com.pantry.entity.MovementType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StockMovementDTO {
    private Long id;

    @NotNull(message = "Inventory item ID is required")
    private Long inventoryItemId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Movement type is required")
    private MovementType type;

    private LocalDateTime movementDate;

    private String notes;
}