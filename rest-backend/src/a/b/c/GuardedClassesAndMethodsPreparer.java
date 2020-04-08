package a.b.c;

import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Set;
import java.util.LinkedHashSet;

import java.lang.reflect.Method;

import org.junit.Assert;


public final class GuardedClassesAndMethodsPreparer {

    private GuardedClassesAndMethodsPreparer() {}


    protected static Map<Class<?>, Set<Method>> getGuardedClassesAndMethods() {
        final Map<Class<?>, Set<Method>> rv = new LinkedHashMap<>();

        rv.put(MainResource.class, (Set<Method>) null); // all methods in class MainResource are protected with no exceptions

        Set<Method> methods = new LinkedHashSet<>();
        methods.add(getMethodLoginOfClassLoginResource());
        methods.add(getEmailUsernameReminder());
        rv.put(LoginResource.class, methods); // protect all methods in class LoginResource except method login
        return rv;
    }

    private static Method getMethodLoginOfClassLoginResource() {
        return getMethodOfClass("login", LoginResource.class);
    }

    private static Method getEmailUsernameReminder() {
        return getMethodOfClass("emailUsernameReminder", LoginResource.class);
    }

    private static Method getMethodOfClass(final String methodNameToLookFor
                                           , final Class<?> klass) {

        final Method[] methods = klass.getDeclaredMethods();
        Method rv = null;
        for (final Method method: methods) {
     
            if (method.getName().equals(methodNameToLookFor)) {
                Assert.assertNull(String.format("Class %s contains more than one method named '%s'"
                                                , klass.getName()
                                                , methodNameToLookFor)
                                  , rv);
                rv = method;
            }
        }
        Assert.assertNotNull(String.format("Class %s contains no method named '%s'"
                                           , klass.getName()
                                           , methodNameToLookFor)
                             , rv);
        return null;
    }


}
