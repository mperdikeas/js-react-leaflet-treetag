package a.b.c;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.Arrays;
import java.util.Map;
import java.util.LinkedHashMap;

import javax.ws.rs.core.Application;

import javax.ws.rs.core.Context;
import javax.servlet.ServletContext;

import org.junit.Assert;

import org.apache.log4j.Logger;


public class JaxRsApplication extends Application {

    protected final Map<String, UserInfo> users = new LinkedHashMap<String, UserInfo>();
    
    final static Logger logger = Logger.getLogger(JaxRsApplication.class);
    
    private Set<Object> singletons = new HashSet<>();

    public JaxRsApplication(@Context ServletContext servletContext) {
        Assert.assertNotNull(servletContext);
        users.put("admin", new UserInfo("pass", "mperdikeas@gmail.com"));
        singletons.add( new MainResource  (servletContext) );
        singletons.add( new LoginResource (servletContext) );
        singletons.add( new CORSFilter() );

        {
            final List<? extends Class<?>> guardedClasses = Arrays.asList(new Class<?>[]{MainResource.class});
            singletons.add( new ValidJWSAccessTokenFilter(guardedClasses
                                                          , logger) );

        }
    }

    public boolean checkCredentials(final String installation, final String username, final String password) {
        if (!installation.equals("a1"))
            return false;
        final UserInfo userInfo = users.get(username);
        if (userInfo == null)
            return false;
        else
            return password.equals(userInfo.password);
    }

    @Override
    public Set<Object> getSingletons() {
        return singletons;
    }


}



