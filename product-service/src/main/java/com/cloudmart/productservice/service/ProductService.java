package com.cloudmart.productservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.cloudmart.productservice.model.Product;
import com.cloudmart.productservice.repository.ProductRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @PostConstruct
    public void seedProducts() {
        if (productRepository.count() > 0) return;

        try {
            RestTemplate restTemplate = new RestTemplate();
            DummyJsonResponse response = restTemplate.getForObject(
                "https://dummyjson.com/products?limit=100",
                DummyJsonResponse.class
            );

            if (response == null || response.getProducts() == null || response.getProducts().isEmpty()) {
                throw new RuntimeException("Réponse vide depuis DummyJSON");
            }

            List<Product> products = response.getProducts().stream()
                .map(dto -> new Product(
                    null,
                    dto.getTitle(),
                    dto.getBrand() != null ? dto.getBrand() : "N/A",
                    dto.getCategory(),
                    dto.getDescription(),
                    dto.getPrice(),
                    dto.getStock() != null ? dto.getStock() : 0,
                    dto.getThumbnail(),
                    null
                ))
                .collect(Collectors.toList());

            productRepository.saveAll(products);
            System.out.println("✅ " + products.size() + " produits importés depuis DummyJSON");

        } catch (Exception e) {
            System.err.println("⚠️ DummyJSON indisponible (" + e.getMessage() + "), fallback sur données locales");
            productRepository.saveAll(List.of(
                new Product(null, "iPhone 15 Pro", "Apple", "Smartphones", "A17 Pro, 48MP, Titane", 1199.99, 50, null, null),
                new Product(null, "Samsung Galaxy S24", "Samsung", "Smartphones", "Snapdragon 8 Gen 3, 50MP", 899.99, 75, null, null),
                new Product(null, "MacBook Pro M3", "Apple", "Laptops", "Puce M3, 16GB RAM, 512GB SSD", 1999.99, 30, null, null),
                new Product(null, "Dell XPS 15", "Dell", "Laptops", "Intel i7, 32GB RAM, 1TB SSD", 1499.99, 25, null, null),
                new Product(null, "Sony WH-1000XM5", "Sony", "Audio", "Réduction de bruit, 30h batterie", 349.99, 100, null, null),
                new Product(null, "AirPods Pro 2", "Apple", "Audio", "Réduction de bruit active, USB-C", 279.99, 150, null, null)
            ));
            System.out.println("✅ 6 produits de fallback insérés");
        }
    }

    // ─── DTOs DummyJSON ───────────────────────────────────────────

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class DummyJsonResponse {
        private List<DummyJsonProduct> products;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class DummyJsonProduct {
        private String title;
        private String description;
        private String category;
        private Double price;
        private Integer stock;
        private String brand;
        private String thumbnail;
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(String id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produit introuvable : " + id));
    }

    public List<Product> findByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> search(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(String id, Product updated) {
        Product existing = findById(id);
        existing.setName(updated.getName());
        existing.setPrice(updated.getPrice());
        existing.setStock(updated.getStock());
        existing.setDescription(updated.getDescription());
        return productRepository.save(existing);
    }

    public void delete(String id) {
        productRepository.deleteById(id);
    }
}