package a.b.c;

import java.util.List;
import java.util.Collections;

import java.lang.reflect.Method;

import java.nio.charset.StandardCharsets;
    

import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.WebApplicationException;

import javax.xml.bind.DatatypeConverter;

import org.junit.Assert;

import org.apache.log4j.Logger;

import java.util.List;
import java.util.Collections;
import java.io.IOException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.HttpHeaders;

import javax.ws.rs.container.ResourceInfo;

import javax.crypto.SecretKey;

import org.junit.Assert;

import org.apache.log4j.Logger;


import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerRequestContext;


import com.google.common.base.Throwables;

import a.b.c.InterAppConstants;
import a.b.gson.GsonHelper;


public class ValidJWSAccessTokenFilter implements ContainerRequestFilter {
    
    private final List<? extends Class<?>>   guardedClasses;
    private Logger                           logger;
    
    public ValidJWSAccessTokenFilter(final List<? extends Class<?>> guardedClasses
                                     , final Logger logger) {
        Assert.assertNotNull(guardedClasses);
        Assert.assertNotNull(logger);
        this.guardedClasses = guardedClasses;
        this.logger         = logger;
    }

    @Context
    private ResourceInfo resourceInfo;

    @Context
    private HttpServletRequest request;

    @SuppressWarnings("rawtypes")
    public final boolean protects(final Class c, final Method m) {
        // simplest possible implementation for the time being: require authorization for *all* methods
        // of any of the guarded class
        for (Class<?> guardedClass: guardedClasses)
            if (c.equals( guardedClass ))
                return true;
        return false;
    }

    @Override
    public void filter(final ContainerRequestContext requestContext) throws IOException {
        boolean SHORT_CIRCUIT = false;
        if (SHORT_CIRCUIT)
            return;
        final Class<?> klass = resourceInfo.getResourceClass();
        final Method method =  resourceInfo.getResourceMethod();
        System.out.printf("*****************************\n\n*************");
        logger.debug(String.format("[inside class %s] HTTP verb is: [%s] - attempting to invoke method [%s] on class [%s]"
                                   , this.getClass().getName()
                                   , requestContext.getMethod()
                                   , method.getName()
                                   , klass.getName()));
        if (protects(klass, method)) {
            logger.debug(String.format("check for ST validity is triggered for method [%s] on class [%s]"
                                       , method.getName()
                                       , klass.getName()));    
        } else {
            logger.debug(String.format("check for ST validity is not enabled for method [%s] on class [%s] - letting the"
                                       +" request proceed with reckless abandon"
                                       , method.getName()
                                       , klass.getName()));
            return;
        } 

        final List<String> cookieHeaders = Collections.list(request.getHeaders(HttpHeaders.COOKIE));
        if (cookieHeaders==null) {
            final String msg = String.format("No %s headers were present (null case)"
                                             , HttpHeaders.COOKIE);
            abortUnauthorizedRequest(requestContext
                                     , Response.Status.FORBIDDEN
                                     , new AbortResponse("no-cookie-header"
                                                         , msg));
            return;
        } else if (cookieHeaders.size()==0) {
            final String msg = String.format("No %s headers were present (0 element list case)"
                                             , HttpHeaders.COOKIE);
            abortUnauthorizedRequest(requestContext
                                     , Response.Status.FORBIDDEN
                                     , new AbortResponse("no-cookie-header"
                                                         , msg));
            return;
        } else if (cookieHeaders.size()>1) {
            final String msg = String.format("Expected 1 %s headers yet encountered: %d. Thou art"
                                             +" not supposed to use more than 1 %s header (%s)"
                                             , HttpHeaders.COOKIE
                                             , cookieHeaders.size()
                                             , HttpHeaders.COOKIE
                                             , "https://stackoverflow.com/a/18967872/274677");
            abortUnauthorizedRequest(requestContext
                                     , Response.Status.BAD_REQUEST
                                     , new AbortResponse("more-than-1-cookie-header"
                                                         , msg));
        }
        Assert.assertEquals(1, cookieHeaders.size());
        final String cookiesStr = cookieHeaders.get(0);
        final String[] cookies = cookiesStr.split(";");
        logger.debug(String.format("[%d] cookies present in [%s]"
                                   , cookies.length
                                   , cookiesStr));
        boolean accessTokenCookieFound = false;
        String accessToken = null;
        for (String cookie: cookies) {
            String cookieTr = cookie.trim();
            logger.debug(String.format("trimmed cookie [%s] to [%s]"
                                       , cookie
                                       , cookieTr));
            String nameValue[] = cookie.split("=");
            if (nameValue.length!=2) {
                final String msg = String.format("Unrecognized cookie format: [%s]"
                                                 , cookieTr);
                abortUnauthorizedRequest(requestContext
                                         , Response.Status.BAD_REQUEST
                                         , new AbortResponse("unrec-cookie-format", msg));
                return;
            } else {
                final String name  = nameValue[0].trim();
                accessToken = nameValue[1].trim();
                logger.debug(String.format("cookie name=[%s], value=[%s]"
                                           , name
                                           , accessToken));
                if (name.equals(InterAppConstants.JWT_COOKIE_NAME)) {
                    if (accessTokenCookieFound) {
                        final String msg = String.format("More than 1 [%s] cookies are found in [%s] header: [%s]"
                                                         , InterAppConstants.JWT_COOKIE_NAME
                                                         , HttpHeaders.COOKIE
                                                         , cookiesStr);
                        abortUnauthorizedRequest(requestContext
                                                 , Response.Status.BAD_REQUEST
                                                 , new AbortResponse("more-than-1-cookies", msg));
                        return;
                    } else {
                        logger.debug(String.format("[%s] %s found with value [%s]"
                                                   , InterAppConstants.JWT_COOKIE_NAME
                                                   , HttpHeaders.COOKIE
                                                   , accessToken));
                        accessTokenCookieFound = true;

                        // must match the value in the webmvc-login app
                        final String secretKeySpecS = "eyJhbGdvcml0aG0iOiJIbWFjU0hBMjU2IiwiZW5jb2RlZEtleSI6InhUMzQ4ZWlXTmMvTVhoeE5ucXU5bG5ZUVBRdVB0WWlQbVM1UGpoc2wrY1FcdTAwM2QifQ==";
                        final String username = JWTUtil.verifyJWS(secretKeySpecS, accessToken);

                        if (username==null) {
                            final String msg = String.format("%s [%s] was not validated"
                                                             , InterAppConstants.JWT_COOKIE_NAME
                                                             , accessToken);
                            abortUnauthorizedRequest(requestContext
                                                     , Response.Status.FORBIDDEN
                                                     , new AbortResponse("JWT-verif-failed"
                                                                         , msg));
                            return;
                        }
                    }
                }
            }
        } // for (String cookie: cookies) {
        if (!accessTokenCookieFound)  {
            final String msg = String.format("No [%s] %s found"
                                             , InterAppConstants.JWT_COOKIE_NAME
                                             , HttpHeaders.COOKIE);
            abortUnauthorizedRequest(requestContext
                                     , Response.Status.FORBIDDEN
                                     , new AbortResponse("no-accesstoken-cookie-found"
                                                         , msg));
            return;                    
        }
    }

    protected void abortUnauthorizedRequest(final ContainerRequestContext requestContext
                                            , final Response.Status status
                                            , final AbortResponse abortResponse) {
        final String entity =  GsonHelper.toJson(abortResponse);
        logger.info(String.format("aborting the request with status: [%s] and abort response: [%s]"
                                   , status
                                  , entity));
        requestContext.abortWith(Response.status(status)
                                 .entity(entity)
                                 .build());
    }    
}

final class AbortResponse {
    public final String code;
    public final String msg;
    public AbortResponse(final String code, final String msg) {
        this.code = code;
        this.msg = msg;
    }
}
