package com.diplomski.util;

import org.apache.commons.beanutils.BeanUtilsBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@ComponentScan("com.diplomski.util")
@EntityScan("com.diplomski.util.entity")
@EnableJpaRepositories("com.diplomski.util.repository")
public class CommonAutoConfiguration {
    @Bean
    @Primary
    public BeanUtilsBean beanUtilsBean() {
        return new IgnoreNullBeanUtilsBean();
    }
}
