package com.springweb.core.util;

import com.springweb.core.entity.User;
import com.springweb.core.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

@Component
public class ExportDataUtils {
    private final UserRepository userRepository;
    public final String VOLUNTEER_DIRECTORY = "resources/user.csv";

    ExportDataUtils(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void exportUserWithSpecificRoleToCsv(String role) throws IOException {
        List<User> userList = userRepository.getAllByRole_Name(role);
        String[] header = {"Họ và tên", "Email", "Số điện thoại"};

        try (BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(VOLUNTEER_DIRECTORY))){
            bufferedWriter.write(String.join(",", header));
            bufferedWriter.newLine();

            for (User user : userList) {
                String[] data = {user.getFullName(), user.getEmail(), user.getPhoneNumber()};

                bufferedWriter.write(String.join(",", data));
                bufferedWriter.newLine();
            }
        }
    }
}
