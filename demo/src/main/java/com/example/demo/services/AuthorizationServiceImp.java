package com.example.demo.services;
import org.springframework.stereotype.Service;
import com.example.demo.Entitie.User;
import com.example.demo.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AuthorizationServiceImp implements AuthorizationService {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    @Override
    public User authorize(String token) throws Exception {
        if (!jwtTokenUtil.validateToken(token)) {
            throw new Exception("Invalid token");
        }
        String username = jwtTokenUtil.getSubject(token);
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new Exception("User not found");
        }
        return user;
    }

    @Override
    public void verify(String token) {
        if (!jwtTokenUtil.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }
    }

    
}

