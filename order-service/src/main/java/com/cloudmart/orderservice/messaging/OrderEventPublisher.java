package com.cloudmart.orderservice.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.cloudmart.orderservice.model.Order;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key}")
    private String routingKey;

    public void publishOrderPlaced(Order order) {
        rabbitTemplate.convertAndSend(exchange, routingKey, order);
        System.out.println("📨 Événement publié dans RabbitMQ : commande #"
            + order.getId());
    }
}