
package com.RECADEP.backend.Entitys;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "field")
public class Field {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "field_id")
    private Long fieldId;

    @Column(name = "field_type")
    private String fieldType;

    @Column(name = "area")
    private Double area;    
    
    @OneToMany(mappedBy = "field", cascade = {CascadeType.REMOVE, CascadeType.MERGE})
    @JsonIgnore
    private List<Rent> rents;
    
    @OneToMany(mappedBy = "field", cascade = {CascadeType.REMOVE, CascadeType.MERGE})
    @JsonIgnore
    private List<Reservation> reservations;

    public Field() {
    }

    public Field(Long fieldId) {
        this.fieldId = fieldId;
    }

    public Long getFieldId() {
        return fieldId;
    }

    public void setFieldId(Long fieldId) {
        this.fieldId = fieldId;
    }

    public String getFieldType() {
        return fieldType;
    }

    public void setFieldType(String fieldType) {
        this.fieldType = fieldType;
    }

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public List<Rent> getRents() {
        return rents;
    }

    public void setRents(List<Rent> rents) {
        this.rents = rents;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((fieldId == null) ? 0 : fieldId.hashCode());
        result = prime * result + ((fieldType == null) ? 0 : fieldType.hashCode());
        result = prime * result + ((area == null) ? 0 : area.hashCode());
        result = prime * result + ((rents == null) ? 0 : rents.hashCode());
        result = prime * result + ((reservations == null) ? 0 : reservations.hashCode());
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
        Field other = (Field) obj;
        if (fieldId == null) {
            if (other.fieldId != null)
                return false;
        } else if (!fieldId.equals(other.fieldId))
            return false;
        if (fieldType == null) {
            if (other.fieldType != null)
                return false;
        } else if (!fieldType.equals(other.fieldType))
            return false;
        if (area == null) {
            if (other.area != null)
                return false;
        } else if (!area.equals(other.area))
            return false;
        if (rents == null) {
            if (other.rents != null)
                return false;
        } else if (!rents.equals(other.rents))
            return false;
        if (reservations == null) {
            if (other.reservations != null)
                return false;
        } else if (!reservations.equals(other.reservations))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Field [fieldId=" + fieldId + ", fieldType=" + fieldType + ", area=" + area + ", rents=" + rents
                + ", reservations=" + reservations + "]";
    }        
}
