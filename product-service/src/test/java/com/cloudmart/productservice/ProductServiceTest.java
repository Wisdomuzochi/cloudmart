package com.cloudmart.productservice;

import com.cloudmart.productservice.model.Product;
import com.cloudmart.productservice.repository.ProductRepository;
import com.cloudmart.productservice.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product fakeProduct;

    @BeforeEach
    void setUp() {
        fakeProduct = new Product();
        fakeProduct.setId("abc123");
        fakeProduct.setName("iPhone 15 Pro");
        fakeProduct.setBrand("Apple");
        fakeProduct.setCategory("Smartphones");
        fakeProduct.setDescription("A17 Pro, 48MP, Titane");
        fakeProduct.setPrice(1199.99);
        fakeProduct.setStock(50);
    }

    // ── Tests findAll ─────────────────────────────────────────

    @Test
    void findAll_ShouldReturnAllProducts() {
        // GIVEN
        when(productRepository.findAll())
            .thenReturn(List.of(fakeProduct));

        // WHEN
        List<Product> result = productService.findAll();

        // THEN
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("iPhone 15 Pro", result.get(0).getName());
    }

    @Test
    void findAll_ShouldReturnEmptyList_WhenNoProducts() {
        // GIVEN
        when(productRepository.findAll()).thenReturn(List.of());

        // WHEN
        List<Product> result = productService.findAll();

        // THEN
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ── Tests findById ────────────────────────────────────────

    @Test
    void findById_ShouldReturnProduct_WhenExists() {
        // GIVEN
        when(productRepository.findById("abc123"))
            .thenReturn(Optional.of(fakeProduct));

        // WHEN
        Product result = productService.findById("abc123");

        // THEN
        assertNotNull(result);
        assertEquals("abc123", result.getId());
        assertEquals("iPhone 15 Pro", result.getName());
    }

    @Test
    void findById_ShouldThrowException_WhenNotFound() {
        // GIVEN
        when(productRepository.findById(anyString()))
            .thenReturn(Optional.empty());

        // WHEN + THEN
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.findById("unknown")
        );

        assertTrue(exception.getMessage().contains("Produit introuvable"));
    }

    // ── Tests create ──────────────────────────────────────────

    @Test
    void create_ShouldSaveAndReturnProduct() {
        // GIVEN
        when(productRepository.save(any(Product.class)))
            .thenReturn(fakeProduct);

        // WHEN
        Product result = productService.create(fakeProduct);

        // THEN
        assertNotNull(result);
        assertEquals("iPhone 15 Pro", result.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    // ── Tests update ──────────────────────────────────────────

    @Test
    void update_ShouldModifyProduct_WhenExists() {
        // GIVEN
        Product updated = new Product();
        updated.setName("iPhone 15 Pro Max");
        updated.setPrice(1399.99);
        updated.setStock(30);
        updated.setDescription("Nouveau modèle");

        when(productRepository.findById("abc123"))
            .thenReturn(Optional.of(fakeProduct));
        when(productRepository.save(any(Product.class)))
            .thenReturn(fakeProduct);

        // WHEN
        Product result = productService.update("abc123", updated);

        // THEN
        assertNotNull(result);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void update_ShouldThrowException_WhenProductNotFound() {
        // GIVEN
        when(productRepository.findById(anyString()))
            .thenReturn(Optional.empty());

        // WHEN + THEN
        assertThrows(
            RuntimeException.class,
            () -> productService.update("unknown", fakeProduct)
        );
    }

    // ── Tests delete ──────────────────────────────────────────

    @Test
    void delete_ShouldCallRepository() {
        // GIVEN
        doNothing().when(productRepository).deleteById(anyString());

        // WHEN
        productService.delete("abc123");

        // THEN
        verify(productRepository, times(1)).deleteById("abc123");
    }

    // ── Tests findByCategory ──────────────────────────────────

    @Test
    void findByCategory_ShouldReturnFilteredProducts() {
        // GIVEN
        when(productRepository.findByCategory("Smartphones"))
            .thenReturn(List.of(fakeProduct));

        // WHEN
        List<Product> result = productService.findByCategory("Smartphones");

        // THEN
        assertEquals(1, result.size());
        assertEquals("Smartphones", result.get(0).getCategory());
    }
}
