package com.pantry.controller;

import com.pantry.dto.InventoryItemDTO;
import com.pantry.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryItemDTO>> getAllItems() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItemDTO> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getItemById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<InventoryItemDTO>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(inventoryService.getItemsByCategory(category));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryItemDTO>> getLowStockItems() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<InventoryItemDTO>> getExpiringItems(
            @RequestParam(defaultValue = "7") int daysThreshold) {
        return ResponseEntity.ok(inventoryService.getExpiringItems(daysThreshold));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryItemDTO> createItem(@Valid @RequestBody InventoryItemDTO itemDTO) {
        return ResponseEntity.ok(inventoryService.createItem(itemDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryItemDTO> updateItem(@PathVariable Long id,
            @Valid @RequestBody InventoryItemDTO itemDTO) {
        return ResponseEntity.ok(inventoryService.updateItem(id, itemDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}