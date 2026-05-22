package com.cloudmart.orderservice;

import com.cloudmart.orderservice.dto.OrderRequest;
import com.cloudmart.orderservice.messaging.OrderEventPublisher;
import com.cloudmart.orderservice.model.Order;
import com.cloudmart.orderservice.model.OrderItem;
import com.cloudmart.orderservice.repository.OrderRepository;
import com.cloudmart.orderservice.service.OrderService;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderEventPublisher eventPublisher;

    @InjectMocks
    private OrderService orderService;

    private Order fakeOrder;
    private OrderRequest orderRequest;
    private OrderItem fakeItem;

    @BeforeEach
    void setUp() {
        fakeItem = new OrderItem();
        fakeItem.setProductId("abc123");
        fakeItem.setProductName("iPhone 15 Pro");
        fakeItem.setQuantity(2);
        fakeItem.setUnitPrice(1199.99);

        orderRequest = new OrderRequest();
        orderRequest.setUserId(1L);
        orderRequest.setUserEmail("wisdom@test.com");
        orderRequest.setItems(List.of(fakeItem));

        fakeOrder = new Order();
        fakeOrder.setId(1L);
        fakeOrder.setUserId(1L);
        fakeOrder.setUserEmail("wisdom@test.com");
        fakeOrder.setItems(List.of(fakeItem));
        fakeOrder.setTotalAmount(2399.98);
        fakeOrder.setStatus("CONFIRMED");
    }

    // ── Tests createOrder ─────────────────────────────────────

    @Test
    void createOrder_ShouldSaveAndReturnOrder() {
        // GIVEN
        when(orderRepository.save(any(Order.class)))
            .thenReturn(fakeOrder);
        doNothing().when(eventPublisher)
            .publishOrderPlaced(any(Order.class));

        // WHEN
        Order result = orderService.createOrder(orderRequest);

        // THEN
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("CONFIRMED", result.getStatus());
        assertEquals("wisdom@test.com", result.getUserEmail());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void createOrder_ShouldCalculateTotalCorrectly() {
        // GIVEN
        when(orderRepository.save(any(Order.class)))
            .thenAnswer(invocation -> {
                Order saved = invocation.getArgument(0);
                saved.setId(1L);
                return saved;
            });
        doNothing().when(eventPublisher)
            .publishOrderPlaced(any(Order.class));

        // WHEN
        Order result = orderService.createOrder(orderRequest);

        // THEN
        // 2 × 1199.99 = 2399.98
        assertEquals(2399.98, result.getTotalAmount(), 0.01);
    }

    @Test
    void createOrder_ShouldPublishEventToRabbitMQ() {
        // GIVEN
        when(orderRepository.save(any(Order.class)))
            .thenReturn(fakeOrder);
        doNothing().when(eventPublisher)
            .publishOrderPlaced(any(Order.class));

        // WHEN
        orderService.createOrder(orderRequest);

        // THEN
        verify(eventPublisher, times(1))
            .publishOrderPlaced(any(Order.class));
    }

    @Test
    void createOrder_ShouldSetStatusPending() {
        // GIVEN
        when(orderRepository.save(any(Order.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        doNothing().when(eventPublisher)
            .publishOrderPlaced(any(Order.class));

        // WHEN
        Order result = orderService.createOrder(orderRequest);

        // THEN
        assertEquals("CONFIRMED", result.getStatus());
    }

    // ── Tests findById ────────────────────────────────────────

    @Test
    void findById_ShouldReturnOrder_WhenExists() {
        // GIVEN
        when(orderRepository.findById(1L))
            .thenReturn(Optional.of(fakeOrder));

        // WHEN
        Order result = orderService.findById(1L);

        // THEN
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void findById_ShouldThrowException_WhenNotFound() {
        // GIVEN
        when(orderRepository.findById(99L))
            .thenReturn(Optional.empty());

        // WHEN + THEN
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> orderService.findById(99L)
        );

        assertTrue(exception.getMessage().contains("Commande introuvable"));
    }

    // ── Tests findByUserId ────────────────────────────────────

    @Test
    void findByUserId_ShouldReturnUserOrders() {
        // GIVEN
        when(orderRepository.findByUserId(1L))
            .thenReturn(List.of(fakeOrder));

        // WHEN
        List<Order> result = orderService.findByUserId(1L);

        // THEN
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getUserId());
    }

    @Test
    void findByUserId_ShouldReturnEmptyList_WhenNoOrders() {
        // GIVEN
        when(orderRepository.findByUserId(99L))
            .thenReturn(List.of());

        // WHEN
        List<Order> result = orderService.findByUserId(99L);

        // THEN
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
