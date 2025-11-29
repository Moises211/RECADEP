package com.RECADEP.backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.RECADEP.backend.Entitys.Field;
import com.RECADEP.backend.Repositories.FieldRepository;

@RestController
@RequestMapping("/api/field")
@CrossOrigin(origins = "${FRONTEND_CORS_DOMAIN}")
public class FieldController {

    @Autowired
    private FieldRepository fieldRepository;

    @GetMapping
    public List<Field> getAllFields() {
        return fieldRepository.findAll();
    }

    @GetMapping("/{id}")
    public Field getField(@PathVariable Long id) {
        return fieldRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Field createField(@RequestBody Field field) {
        return fieldRepository.save(field);
    }

    @PutMapping("/{id}")
    public Field updateField(@PathVariable Long id, @RequestBody Field field) {

        field.setFieldId(id);
        return fieldRepository.save(field);
    }

    @DeleteMapping("/{id}")
    public void deleteField(@PathVariable Long id) {
        fieldRepository.deleteById(id);
    }

    @GetMapping("/by-type")
    public List<Field> getFieldsByType(@RequestParam String type) {
        return fieldRepository.findByFieldType(type);
    }
}
