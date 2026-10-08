package com.example.hotel_management.service;

import com.example.hotel_management.entity.Booking;
import com.example.hotel_management.entity.Customer;
import com.example.hotel_management.entity.Room;
import com.example.hotel_management.repository.BookingRepository;
import com.example.hotel_management.repository.CustomerRepository;
import com.example.hotel_management.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final RoomRepository roomRepository;

    public BookingService(
            BookingRepository bookingRepository,
            CustomerRepository customerRepository,
            RoomRepository roomRepository) {

        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(Booking booking) {

        if (booking.getCustomer() == null ||
                booking.getCustomer().getId() == null) {

            throw new RuntimeException("Customer is required");
        }

        if (booking.getRoom() == null ||
                booking.getRoom().getId() == null) {

            throw new RuntimeException("Room is required");
        }

        Customer customer = customerRepository
                .findById(booking.getCustomer().getId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        Room room = roomRepository
                .findById(booking.getRoom().getId())
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        if (!room.isAvailable()) {
            throw new RuntimeException("Room is not available");
        }

        booking.setCustomer(customer);
        booking.setRoom(room);

        if (booking.getStatus() == null ||
                booking.getStatus().isBlank()) {

            booking.setStatus("CONFIRMED");
        }

        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id, Booking bookingDetails) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if (bookingDetails.getCustomer() == null ||
                bookingDetails.getCustomer().getId() == null) {

            throw new RuntimeException("Customer is required");
        }

        if (bookingDetails.getRoom() == null ||
                bookingDetails.getRoom().getId() == null) {

            throw new RuntimeException("Room is required");
        }

        Customer customer = customerRepository
                .findById(bookingDetails.getCustomer().getId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        Room room = roomRepository
                .findById(bookingDetails.getRoom().getId())
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        booking.setCustomer(customer);
        booking.setRoom(room);
        booking.setCheckInDate(bookingDetails.getCheckInDate());
        booking.setCheckOutDate(bookingDetails.getCheckOutDate());
        booking.setStatus(bookingDetails.getStatus());

        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}