## Project structure

````
src/
└── main/
    ├── java/com/springweb/core/
    │     ├── config/          # Cấu hình Spring, Security, CORS, Beans, Swagger...
    │     ├── controller/      # REST Controllers (API endpoints)
    │     ├── entity/          # Entities (JPA/Hibernate mapping)
    │     ├── exception/       # Custom exceptions + global handler
    │     ├── repository/      # Repository interface (DAO layer - JPA/Hibernate)
    │     ├── service/         
    │     │     ├── impl/      # Implementation classes của service
    │     │     └── ...        # Service interface
    │     ├── util/            # Helper utilities (validators, converters...)
    │     └── ProjectApplication.java  # Main class (Spring Boot entry point)
    │
    └── resources/
        ├── application.properties
        ├── static/          # Static files (HTML, CSS, JS nếu có)
        ├── templates/       # Thymeleaf/Freemarker templates (nếu dùng)
        └── 
````

## Setup 

### Prerequisites

- IntelliJ IDEA
- JDK21
- OpenJFX 21

### Step by step

- Clone and open this repository in IntelliJ IDEA
- Config the project SDK to JDK21 (File -> Project Structure -> Project Settings -> Project)
- Open Maven tool window and run `clean` and `install`
