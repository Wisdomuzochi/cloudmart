package com.cloudmart.notificationservice.messaging;

import java.util.Map;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {

    @RabbitListener(queues = "${rabbitmq.queue}")
    public void handleOrderPlaced(Map<String, Object> order) {
        System.out.println("==================================");
        System.out.println("📧 NOUVELLE COMMANDE REÇUE !");
        System.out.println("Commande ID : " + order.get("id"));
        System.out.println("Client      : " + order.get("userEmail"));
        System.out.println("Montant     : " + order.get("totalAmount") + " €");
        System.out.println("Statut      : " + order.get("status"));
        System.out.println("==================================");
        System.out.println("✅ Email de confirmation envoyé à : "
            + order.get("userEmail"));
    }
}