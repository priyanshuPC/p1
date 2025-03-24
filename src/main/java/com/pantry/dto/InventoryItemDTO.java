package com.pantry.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class InventoryItemDTO {
    private Long id;

    @NotBlank(message = "Item name is required")
    private String name;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotBlank(message = "Category is required")
    private String category;

    private LocalDate expiryDate;

    private String supplierName;

    private String supplierContact;

    @Min(value = 0, message = "Low stock threshold cannot be negative")
    private Integer lowStockThreshold;

    private LocalDate createdAt;
    private LocalDate updatedAt;
}