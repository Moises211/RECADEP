package com.RECADEP.backend.Entitys;



import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "registration_date")
    private String registrationDate;

    @OneToOne
    @JoinColumn(name = "users_id", unique = true, nullable = false)
    @JsonIgnoreProperties({"customers", "employees"})
    private Users users;

    @OneToMany(mappedBy = "customer", cascade = {CascadeType.REMOVE, CascadeType.MERGE})
    @JsonIgnore
    private java.util.List<Reservation> reservations;

    @OneToMany(mappedBy = "customer", cascade = {CascadeType.REMOVE, CascadeType.MERGE})
    @JsonIgnore
    private java.util.List<Rent> rents;

    public Customer() {
    }

    public Customer(Long customerId) {
        this.customerId = customerId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(String registrationDate) {
        this.registrationDate = registrationDate;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public java.util.List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(java.util.List<Reservation> reservations) {
        this.reservations = reservations;
    }

    public java.util.List<Rent> getRents() {
        return rents;
    }

    public void setRents(java.util.List<Rent> rents) {
        this.rents = rents;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((customerId == null) ? 0 : customerId.hashCode());
        result = prime * result + ((registrationDate == null) ? 0 : registrationDate.hashCode());
        result = prime * result + ((users == null) ? 0 : users.hashCode());
        result = prime * result + ((reservations == null) ? 0 : reservations.hashCode());
        result = prime * result + ((rents == null) ? 0 : rents.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Customer other = (Customer) obj;
        if (customerId == null) {
            if (other.customerId != null)
                return false;
        } else if (!customerId.equals(other.customerId))
            return false;
        if (registrationDate == null) {
            if (other.registrationDate != null)
                return false;
        } else if (!registrationDate.equals(other.registrationDate))
            return false;
        if (users == null) {
            if (other.users != null)
                return false;
        } else if (!users.equals(other.users))
            return false;
        if (reservations == null) {
            if (other.reservations != null)
                return false;
        } else if (!reservations.equals(other.reservations))
            return false;
        if (rents == null) {
            if (other.rents != null)
                return false;
        } else if (!rents.equals(other.rents))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Customer [customerId=" + customerId + ", registrationDate=" + registrationDate + ", users=" + users
                + ", reservations=" + reservations + ", rents=" + rents + "]";
    }        
}
