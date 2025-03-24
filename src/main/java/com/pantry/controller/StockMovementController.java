package com.pantry.controller;

import com.pantry.dto.StockMovementDTO;
import com.pantry.service.StockMovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/movements")
@RequiredArgsConstructor
public class StockMovementController {
    private final StockMovementService stockMovementService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StockMovementDTO> createMovement(@Valid @RequestBody StockMovementDTO movementDTO) {
        return ResponseEntity.ok(stockMovementService.createMovement(movementDTO));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<StockMovementDTO>> getMovementsByItemId(@PathVariable Long itemId) {
        return ResponseEntity.ok(stockMovementService.getMovementsByItemId(itemId));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<StockMovementDTO>> getMovementsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(stockMovementService.getMovementsByDateRange(startDate, endDate));
    }
}