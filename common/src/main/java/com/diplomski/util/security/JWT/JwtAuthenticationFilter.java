package com.diplomski.util.security.JWT;

import com.diplomski.util.entity.UserEntity;
import com.diplomski.util.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LogManager.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String path = request.getRequestURI();
        logger.info("JwtFilter hit path:{}", path);

        if (path.startsWith("/auth/login") || path.startsWith("/auth/register")) {
            logger.info("JwtFilter SKIPPED for path:{}", path);
            filterChain.doFilter(request, response);
            return;
        }

        String token = null;
        String id = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            id = jwtUtil.extractId(token);
        }

        if (id != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserEntity userEntity;
            try {
                userEntity = userDetailsService.getUserById(Long.valueOf(id));
            } catch (ChangeSetPersister.NotFoundException e) {
                throw new RuntimeException(e);
            }
            if (jwtUtil.isTokenValid(token, userEntity)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userEntity, null, userEntity.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
