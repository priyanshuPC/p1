package com.pantry.service;

import com.pantry.dto.InventoryItemDTO;
import com.pantry.entity.InventoryItem;
import com.pantry.repository.InventoryItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryItemRepository inventoryItemRepository;

    @Transactional
    public InventoryItemDTO createItem(InventoryItemDTO itemDTO) {
        InventoryItem item = convertToEntity(itemDTO);
        InventoryItem savedItem = inventoryItemRepository.save(item);
        return convertToDTO(savedItem);
    }

    public InventoryItemDTO getItemById(Long id) {
        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inventory item not found"));
        return convertToDTO(item);
    }

    public List<InventoryItemDTO> getAllItems() {
        return inventoryItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventoryItemDTO> getItemsByCategory(String category) {
        return inventoryItemRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventoryItemDTO> getLowStockItems() {
        return inventoryItemRepository.findLowStockItems().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventoryItemDTO> getExpiringItems(int daysThreshold) {
        LocalDate thresholdDate = LocalDate.now().plusDays(daysThreshold);
        return inventoryItemRepository.findExpiringItems(thresholdDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InventoryItemDTO updateItem(Long id, InventoryItemDTO itemDTO) {
        InventoryItem existingItem = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inventory item not found"));

        updateEntityFromDTO(existingItem, itemDTO);
        InventoryItem updatedItem = inventoryItemRepository.save(existingItem);
        return convertToDTO(updatedItem);
    }

    @Transactional
    public void deleteItem(Long id) {
        if (!inventoryItemRepository.existsById(id)) {
            throw new EntityNotFoundException("Inventory item not found");
        }
        inventoryItemRepository.deleteById(id);
    }

    private InventoryItem convertToEntity(InventoryItemDTO dto) {
        InventoryItem item = new InventoryItem();
        updateEntityFromDTO(item, dto);
        return item;
    }

    private void updateEntityFromDTO(InventoryItem item, InventoryItemDTO dto) {
        item.setName(dto.getName());
        item.setQuantity(dto.getQuantity());
        item.setCategory(dto.getCategory());
        item.setExpiryDate(dto.getExpiryDate());
        item.setSupplierName(dto.getSupplierName());
        item.setSupplierContact(dto.getSupplierContact());
        item.setLowStockThreshold(dto.getLowStockThreshold());
    }

    private InventoryItemDTO convertToDTO(InventoryItem item) {
        InventoryItemDTO dto = new InventoryItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setQuantity(item.getQuantity());
        dto.setCategory(item.getCategory());
        dto.setExpiryDate(item.getExpiryDate());
        dto.setSupplierName(item.getSupplierName());
        dto.setSupplierContact(item.getSupplierContact());
        dto.setLowStockThreshold(item.getLowStockThreshold());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
}