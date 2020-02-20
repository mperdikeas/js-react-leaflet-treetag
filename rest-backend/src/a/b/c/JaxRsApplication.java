package a.b.c;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.Arrays;

import javax.ws.rs.core.Application;

import javax.ws.rs.core.Context;
import javax.servlet.ServletContext;

import org.junit.Assert;

import org.apache.log4j.Logger;


public class JaxRsApplication extends Application {
    
    final static Logger logger = Logger.getLogger(JaxRsApplication.class);
    
    private Set<Object> singletons = new HashSet<>();

    public JaxRsApplication(@Context ServletContext servletContext) {
        Assert.assertNotNull(servletContext);
        singletons.add( new MainResource  (servletContext) );
        singletons.add( new LoginResource (servletContext) );
        singletons.add( new CORSFilter() );

        {
            final List<? extends Class<?>> guardedClasses = Arrays.asList(new Class<?>[]{MainResource.class});
            singletons.add( new ValidJWSAccessTokenFilter(guardedClasses
                                                          , logger) );

        }
    }

    @Override
    public Set<Object> getSingletons() {
        return singletons;
    }


}
