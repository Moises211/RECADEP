package com.RECADEP.backend; // <--- ¡Asegúrate de usar tu paquete base!

import com.RECADEP.backend.Entitys.*;

import com.RECADEP.backend.Repositories.*;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Configuration
public class DataInitializer {

    // Formateador para convertir tus fechas (ej: '03/11/1999') a LocalDate
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.getDefault());

    @Bean
    @Transactional
    CommandLineRunner initDatabase(
            FieldRepository fieldRepository,
            UsersRepository usersRepository,
            CustomerRepository customerRepository,
            EmployeeRepository employeeRepository) {

        return args -> {
            // Utilizamos el conteo de Fields para determinar si la DB ya fue inicializada.
            if (fieldRepository.count() == 0) {

                System.out.println("--- Ejecutando inicialización de datos (Data Seeding) ---");

                // --- 1. INSERCIÓN DE FIELDS ---
                Field[] fiel = new Field[6];
                fiel[0] = new Field();fiel[0].setArea(10.00); fiel[0].setFieldType("tenis");
                fiel[1] = new Field();fiel[1].setArea(12.00); fiel[1].setFieldType("tenis");
                fiel[2] = new Field();fiel[2].setArea(14.00); fiel[2].setFieldType("futbol");
                fiel[3] = new Field();fiel[3].setArea(15.00); fiel[3].setFieldType("futbol");
                fiel[4] = new Field();fiel[4].setArea(16.00); fiel[4].setFieldType("padel");
                fiel[5] = new Field();fiel[5].setArea(20.00); fiel[5].setFieldType("padel");
                for (Field field : fiel) {
                    fieldRepository.save(field);
                }
                short a;
                short b;
                Users user1;
                // --- 2. INSERCIÓN DE USERS ---
                // Nota: Asumo que el constructor o setters manejan la conversión de tipos
                
                // Usuario 1: Moises Acosta (CUSTOMER)
                /*user1 = new Users();
                user1.setBirthdate("03/11/1999");
                a = 5882;
                
                user1.setDocumentNumber(a);
                user1.setLastname("Acosta");
                user1.setUsername("Moises");
                user1.setEmail("moisesacosta8@gmail.com");
                b = 7268;
                user1.setTelephone(b);
                user1 = usersRepository.save(user1); // Guardar para obtener el ID
                */
                // Usuario 2: Moises Alvarenga (EMPLOYEE)
                Users user2 = new Users();
                user2.setBirthdate("1999-11-03");
                a = 5883;
                user2.setDocumentNumber(a);
                user2.setLastname("Alvarenga");
                user2.setUsername("Moises");
                user2.setEmail("aa20029@ues.edu.sv");
                b = 7168;
                user2.setTelephone(b);
                user2 = usersRepository.save(user2); // Guardar para obtener el ID

                // --- 3. INSERCIÓN DE CUSTOMER (FK a User 1) ---
                /*Customer customer = new Customer();
                customer.setUsers(user1);
                customer.setRegistrationDate("03/11/2025"); 
                customerRepository.save(customer);*/

                // --- 4. INSERCIÓN DE EMPLOYEE (FK a User 2) ---
                Employee employee = new Employee();
                employee.setUsers(user2);
                employee.setDateHired("2025-11-05"); 
                employee.setPosition("GERENTE");
                employeeRepository.save(employee);


                System.out.println("--- Inicialización de datos completada con éxito. ---");

            } else {
                System.out.println("Base de datos ya poblada. Omitiendo la inicialización de datos semilla.");
            }
        };
    }
}