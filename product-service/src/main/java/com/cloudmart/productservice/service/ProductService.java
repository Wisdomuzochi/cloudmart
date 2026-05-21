package com.cloudmart.productservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cloudmart.productservice.model.Product;
import com.cloudmart.productservice.repository.ProductRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // Seeds — données de test au démarrage
    @PostConstruct
    public void seedProducts() {
        if (productRepository.count() == 0) {
            productRepository.saveAll(List.of(
                new Product(null, "iPhone 15 Pro", "Apple",
                    "Smartphones", "A17 Pro, 48MP, Titane",
                    1199.99, 50, null, null),
                new Product(null, "Samsung Galaxy S24", "Samsung",
                    "Smartphones", "Snapdragon 8 Gen 3, 50MP",
                    899.99, 75, null, null),
                new Product(null, "MacBook Pro M3", "Apple",
                    "Laptops", "Puce M3, 16GB RAM, 512GB SSD",
                    1999.99, 30, null, null),
                new Product(null, "Dell XPS 15", "Dell",
                    "Laptops", "Intel i7, 32GB RAM, 1TB SSD",
                    1499.99, 25, null, null),
                new Product(null, "Sony WH-1000XM5", "Sony",
                    "Audio", "Réduction de bruit, 30h batterie",
                    349.99, 100, null, null),
                new Product(null, "iPad Pro 12.9", "Apple",
                    "Tablettes", "Puce M2, écran Liquid Retina",
                    1099.99, 40, null, null),
                new Product(null, "Samsung Galaxy Tab S9", "Samsung",
                    "Tablettes", "AMOLED 11 pouces, S Pen inclus",
                    799.99, 35, null, null),
                new Product(null, "AirPods Pro 2", "Apple",
                    "Audio", "Réduction de bruit active, USB-C",
                    279.99, 150, null, null)
            ));
            System.out.println("✅ 8 produits insérés dans MongoDB");
        }
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