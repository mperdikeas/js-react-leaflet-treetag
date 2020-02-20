package a.b.c;

import javax.servlet.ServletContext;

import org.junit.Assert;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import freemarker.template.Configuration;
import freemarker.template.TemplateExceptionHandler;

    
public class ContextRefreshedEventApplicationListenerBean implements ApplicationListener<ContextRefreshedEvent> {

    @Override
    public void onApplicationEvent(ContextRefreshedEvent ev) {
        ApplicationContext applicationContext = ev.getApplicationContext();
        Assert.assertNotNull(applicationContext);
        Assert.assertTrue(String.format("application context was of class [%s] and not an instance of [%s]"
                                        , applicationContext.getClass().getName()
                                        , WebApplicationContext.class.getName())
                          , applicationContext instanceof WebApplicationContext);
        WebApplicationContext webApplicationContext = (WebApplicationContext) applicationContext;
        ServletContext servletContext = webApplicationContext.getServletContext();
        setFreeMarkerConfiguration (servletContext);
    }

    private void setFreeMarkerConfiguration(ServletContext servletContext) {
        Configuration fmConfiguration = null;
        {
            fmConfiguration = new Configuration(Configuration.VERSION_2_3_23);
            fmConfiguration.setClassForTemplateLoading(this.getClass(), "");
            fmConfiguration.setDefaultEncoding("UTF-8");

            // Sets how errors will appear.
            // During web page *development* TemplateExceptionHandler.HTML_DEBUG_HANDLER is better.
            fmConfiguration.setTemplateExceptionHandler(TemplateExceptionHandler.HTML_DEBUG_HANDLER);
            // fmConfiguration.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);

            // Don't log exceptions inside FreeMarker that it will thrown at you anyway:
            fmConfiguration.setLogTemplateExceptions(false);

            // https://freemarker.apache.org/docs/app_faq.html#faq_number_grouping
            fmConfiguration.setNumberFormat("0.#########");
        }
        Assert.assertNotNull(fmConfiguration);
        ApplicationScopeAttribute.FREEMARKER_CONFIGURATION.set(servletContext, fmConfiguration);
    }    
}

