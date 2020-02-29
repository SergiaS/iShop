package org.example.config;

import org.example.filter.SimpleFilter3;
import org.example.servlet.JavaConfigServlet;

import javax.servlet.*;
import java.util.Set;

public class ApplicationConfigInitializer implements ServletContainerInitializer {
    public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
        JavaConfigServlet servlet = new JavaConfigServlet();
        ServletRegistration.Dynamic servletConfig = ctx.addServlet("JavaConfigServlet", servlet);
        servletConfig.addMapping("/java");
        System.out.println("ApplicationConfigInitializer");

        FilterRegistration.Dynamic filterConfig = ctx.addFilter("SimpleFilter3", new SimpleFilter3());
        filterConfig.addMappingForUrlPatterns(null, true, "/*");
    }
}
