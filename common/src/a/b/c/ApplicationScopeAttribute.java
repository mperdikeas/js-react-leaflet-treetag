package a.b.c;

import org.junit.Assert;
import javax.servlet.ServletContext;

import freemarker.template.Configuration;


public enum ApplicationScopeAttribute {
    FREEMARKER_CONFIGURATION("freemarker-configuration", Configuration.class)
    ;

    private final String value;
    private final Class  klass;

    private ApplicationScopeAttribute(final String value, Class klass) {
        this.value = value;
        this.klass = klass;
    }
    
      
    public String getValue() {
        return value;
    }

    @SuppressWarnings("unchecked")
    public <T> T get(final ServletContext servletContext, Class<T> klass) {
        Assert.assertEquals(this.klass, klass);
        Object o = servletContext.getAttribute(this.getValue());
        if (o!=null) {
            Assert.assertEquals(o.getClass(), this.klass);
            return (T) servletContext.getAttribute(this.getValue());
        } else
            return null;
    }

    public void set(final ServletContext servletContext, final Object o) {
        Assert.assertNull(String.format("Attribute [%s] already exists. It should be noted that, in principle, there is nothing "  +
                                        "wrong about re-setting an attribute on the servlet context but it is something I don't "  +
                                        "happen to do in this particular application, hence I assert that this is not happenning. "+
                                        "Should conditions change you might want to remove this assertion."
                                        , this.getValue())
                          , servletContext.getAttribute(this.getValue()));
        if (o!=null)
            Assert.assertEquals(klass, o.getClass());
        servletContext.setAttribute(this.getValue(), o);
    }
    public void remove(final ServletContext servletContext) {
        servletContext.removeAttribute(this.getValue());
    }
    public boolean isPresent(final ServletContext servletContext) {
        return this.get(servletContext, Object.class)!=null;
    }
}
