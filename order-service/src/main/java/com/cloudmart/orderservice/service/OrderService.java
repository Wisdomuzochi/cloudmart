package com.cloudmart.orderservice.service;

import com.cloudmart.orderservice.dto.OrderRequest;
import com.cloudmart.orderservice.messaging.OrderEventPublisher;
import com.cloudmart.orderservice.model.Order;
import com.cloudmart.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventPublisher eventPublisher;

    public Order createOrder(OrderRequest request) {
        // Calcul du montant total
        double total = request.getItems().stream()
            .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
            .sum();

        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setUserEmail(request.getUserEmail());
        order.setItems(request.getItems());
        order.setTotalAmount(total);
        order.setStatus("PENDING");

        // Sauvegarde en BDD
        Order saved = orderRepository.save(order);

        // Publie l'événement dans RabbitMQ
        eventPublisher.publishOrderPlaced(saved);

        return saved;
    }

    public Order findById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Commande introuvable : " + id));
    }

    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }
}