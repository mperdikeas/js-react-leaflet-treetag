package a.b.c;

import java.util.List;
import java.util.Collections;

import java.lang.reflect.Method;

import java.nio.charset.StandardCharsets;
    

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

import io.jsonwebtoken.Claims;

import a.b.c.constants.Installation;

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

    private static String getBearerAuthorizationHeader(final Logger logger, final HttpServletRequest request) throws BearerAuthorizationHeaderException {

        final List<String> authorizationHeaders = Collections.list(request.getHeaders(HttpHeaders.AUTHORIZATION));
        if ((authorizationHeaders==null) || (authorizationHeaders.size()==0)) {
            final String msg = (authorizationHeaders==null)?"null case":"0 elements list case";
            throw new BearerAuthorizationHeaderException(BearerAuthorizationFailureMode.NO_AUTHORIZATION_HEADERS_AT_ALL, msg);
        }

        
        if (authorizationHeaders.size()>1) {
            throw new BearerAuthorizationHeaderException(BearerAuthorizationFailureMode.MORE_THAN_ONE_AUTHORIZATION_HEADER, String.valueOf(authorizationHeaders.size()));
        }
        Assert.assertEquals(1, authorizationHeaders.size());
        final String authorizationHeader = authorizationHeaders.get(0);
        final String[] authorizations = authorizationHeader.split(",");

        logger.debug(String.format("[%d] authorizations present in [%s]"
                                   , authorizations.length
                                   , authorizationHeader));
        String accessToken = null;
        final String BEARER = "bearer";
        for (int i = 0 ; i < authorizations.length ; i++) {
            final String authorization = authorizations[i];
            final String authorizationTr = authorization.trim();
            logger.debug(String.format("trimmed authorization %d of %d from [%s] to [%s]"
                                       , i
                                       , authorizations.length
                                       , authorization
                                       , authorizationTr));
            String nameValue[] = authorizationTr.split(" ");
            if (nameValue.length!=2) {
                final String msg = String.format("Unrecognized form: [%s] in the %d-th authorization"
                                                 , authorizationTr
                                                 , i);
                throw new BearerAuthorizationHeaderException(BearerAuthorizationFailureMode.UNREC_AUTH_HEADER_FORMAT, msg);
            } else {
                final String name  = nameValue[0].trim();
                if (name.toLowerCase().equals(BEARER)) {
                    if (accessToken!=null) {
                        final String msg = String.format("More than 1 %s tokens found in %s header: [%s]"
                                                         , BEARER
                                                         , HttpHeaders.AUTHORIZATION
                                                         , authorizationHeader);
                        throw new BearerAuthorizationHeaderException(BearerAuthorizationFailureMode.MORE_THAN_ONE_BEARER_TOKENS, msg);                        
                    } else {
                        accessToken = nameValue[1].trim();
                    }
                }
                logger.debug(String.format("authorization name=[%s], value=[%s]"
                                           , name
                                           , accessToken));
            }
        } // for (int i = 0 ; i < authorizations.length ; i++) {
        if (accessToken == null){
            final String msg = String.format("No %s tokens are found in %s header: [%s]"
                                             , BEARER
                                             , HttpHeaders.AUTHORIZATION
                                             , authorizationHeader);            
            throw new BearerAuthorizationHeaderException(BearerAuthorizationFailureMode.NO_BEARER_TOKEN, null);
        } else
            return accessToken;
    }

    @Override
    public void filter(final ContainerRequestContext requestContext) throws IOException {
        boolean SHORT_CIRCUIT = false;
        if (SHORT_CIRCUIT)
            return;
        final Class<?> klass = resourceInfo.getResourceClass();
        final Method method =  resourceInfo.getResourceMethod();
        logger.debug(String.format("%s::filter() # HTTP verb is: [%s] - attempting to invoke method [%s] on class [%s]"
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

        try {
            final String accessToken = getBearerAuthorizationHeader(logger, request);
            // must match the value in the webmvc-login app
            final String secretKeySpecS = "eyJhbGdvcml0aG0iOiJIbWFjU0hBMjU2IiwiZW5jb2RlZEtleSI6InhUMzQ4ZWlXTmMvTVhoeE5ucXU5bG5ZUVBRdVB0WWlQbVM1UGpoc2wrY1FcdTAwM2QifQ==";
            try {
                final Claims claims = JWTUtil.verifyJWS(secretKeySpecS, accessToken);
                final String installation = Installation.getFromClaims(claims);

                Installation.setInContainerRequestContext(requestContext, installation);

            } catch (final Throwable t) {
                final String msg = String.format("JWT Bearer %s access token [%s] was not verified. Error msg is [%s]"
                                                 , HttpHeaders.AUTHORIZATION
                                                 , accessToken
                                                 , t.getMessage());
                abortUnauthorizedRequest(requestContext
                                         , Response.Status.FORBIDDEN
                                         , new AbortResponse(BearerAuthorizationFailureMode.JWT_VERIFICATION_FAILED.code
                                                             , msg
                                                             , Throwables.getStackTraceAsString(t)));
                return;
            }
        } catch (BearerAuthorizationHeaderException exc) {
            abortUnauthorizedRequest(requestContext
                                     , Response.Status.FORBIDDEN
                                     , new AbortResponse(exc.mode.code
                                                         , exc.msg
                                                         , (String) null));
            return;
        }
    }
    

    public void filter_OLD_IMPLEMENTATION_USES_COOKIE_HEADER(final ContainerRequestContext requestContext) throws IOException {
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
                                                         , msg
                                                         , (String) null));
            return;
        } else if (cookieHeaders.size()==0) {
            final String msg = String.format("No %s headers were present (0 element list case)"
                                             , HttpHeaders.COOKIE);
            abortUnauthorizedRequest(requestContext
                                     , Response.Status.FORBIDDEN
                                     , new AbortResponse("no-cookie-header"
                                                         , msg
                                                         , (String) null));
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
                                                         , msg
                                                         , (String) null));
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
                                         , new AbortResponse("unrec-cookie-format"
                                                             , msg
                                                             , (String) null));
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
                                                 , new AbortResponse("more-than-1-cookies"
                                                                     , msg
                                                                     , (String) null));
                        return;
                    } else {
                        logger.debug(String.format("[%s] %s found with value [%s]"
                                                   , InterAppConstants.JWT_COOKIE_NAME
                                                   , HttpHeaders.COOKIE
                                                   , accessToken));
                        accessTokenCookieFound = true;

                        // must match the value in the webmvc-login app
                        final String secretKeySpecS = "eyJhbGdvcml0aG0iOiJIbWFjU0hBMjU2IiwiZW5jb2RlZEtleSI6InhUMzQ4ZWlXTmMvTVhoeE5ucXU5bG5ZUVBRdVB0WWlQbVM1UGpoc2wrY1FcdTAwM2QifQ==";
                        final Claims claims = JWTUtil.verifyJWS(secretKeySpecS, accessToken);

                        if (claims==null) {
                            final String msg = String.format("%s [%s] was not validated"
                                                             , InterAppConstants.JWT_COOKIE_NAME
                                                             , accessToken);
                            abortUnauthorizedRequest(requestContext
                                                     , Response.Status.FORBIDDEN
                                                     , new AbortResponse("JWT-verif-failed"
                                                                         , msg
                                                                         , (String) null));
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
                                                         , msg
                                                         , (String) null));
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
    public final String details;
    public AbortResponse(final String code
                         , final String msg
                         , final String details) {
        this.code = code;
        this.msg = msg;
        this.details = details;
    }
}
