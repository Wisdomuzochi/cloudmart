package com.cloudmart.orderservice.dto;

import java.util.List;

import com.cloudmart.orderservice.model.OrderItem;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

    @NotNull
    private Long userId;

    @NotNull
    private String userEmail;

    @NotEmpty
    private List<OrderItem> items;
}