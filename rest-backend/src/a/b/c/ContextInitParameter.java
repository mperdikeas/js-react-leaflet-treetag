package a.b.c;

import org.junit.Assert;
import javax.servlet.ServletContext;


public enum ContextInitParameter {
    JNDI_NAME_FOR_EMAIL_SESSION  ("mailSession.jndiName")
    ;


    private ContextInitParameter(final String value) {
        this(value, false);
    }

    private ContextInitParameter(final String value, final boolean isPseudoMap) {
        this.value = value;
        this.isPseudoMap = isPseudoMap;
    }    
    
    private String  value;
    private boolean isPseudoMap;

    public String get(final ServletContext servletContext) {
        Assert.assertFalse(isPseudoMap);
        Assert.assertNotNull(servletContext);
        String rv = servletContext.getInitParameter(this.value);
        Assert.assertNotNull(String.format("Problem retrieving [%s]"
                                           , value)
                             , rv);
        return rv;
    }

    public String getFromPseudoMap(final ServletContext servletContext, final String key) {
        Assert.assertTrue(isPseudoMap);        
        Assert.assertNotNull(servletContext);
        String effectiveInitParam = String.format("%s.%s"
                                                  , this.value
                                                  , key);
        String rv = servletContext.getInitParameter(effectiveInitParam);
        Assert.assertNotNull(String.format("Problem retrieving [%s]"
                                           , effectiveInitParam)
                             , rv);
        return rv;
    }

    public boolean getBoolean(final ServletContext servletContext) {
        String rvS = get(servletContext);
        if ("true".equalsIgnoreCase(rvS))
            return true;
        else if ("false".equalsIgnoreCase(rvS))
            return false;
        else {
            Assert.fail(String.format("Unrecognized boolean value: [%s]", rvS));
            return false; // ain't gonna happen; this is just to satisfy javac's control flow analysis
        }
    }      

    public boolean isPresent(final ServletContext servletContext) {
        return this.get(servletContext)!=null;
    }

    public String getValue() {
        return value;
    }
    
}
