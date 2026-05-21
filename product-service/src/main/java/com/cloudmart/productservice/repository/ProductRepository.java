package com.cloudmart.productservice.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.cloudmart.productservice.model.Product;

public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByCategory(String category);
    List<Product> findByBrand(String brand);
    List<Product> findByNameContainingIgnoreCase(String name);
}