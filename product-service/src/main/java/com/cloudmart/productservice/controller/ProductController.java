package com.cloudmart.productservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cloudmart.productservice.model.Product;
import com.cloudmart.productservice.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable String id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(productService.findByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(
            @RequestParam String name) {
        return ResponseEntity.ok(productService.search(name));
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        return ResponseEntity.ok(productService.create(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(
            @PathVariable String id,
            @RequestBody Product product) {
        return ResponseEntity.ok(productService.update(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}