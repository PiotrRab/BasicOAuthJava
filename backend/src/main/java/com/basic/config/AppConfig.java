package com.basic.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(
        prefix = "com.base"
)
@Getter
@Setter
public class AppConfig {

    private String jwtSecret;
    private String refreshSecret;
    private long jwtExpiration;
    private long refreshExpiration;
}
