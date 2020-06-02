package a.b.c;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.Date;
import java.util.Collections;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicInteger;

import java.io.File;
import java.io.OutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;

import java.lang.reflect.Type;

import com.google.common.base.Joiner;
import com.google.common.base.Throwables;
import com.google.gson.reflect.TypeToken;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PathParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;

import javax.ws.rs.CookieParam;
import javax.ws.rs.BadRequestException;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.HttpHeaders;
// import javax.inject.Singleton;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

import javax.xml.bind.DatatypeConverter;

import org.junit.Assert;

import org.apache.log4j.Logger;

import a.b.gson.GsonHelper;

import javax.crypto.SecretKey;
import io.jsonwebtoken.Jwts;

import java.time.LocalDateTime;
import java.time.ZoneId;

import a.b.c.constants.Installation;

// To support the Singleton annotation in a Tomcat 8.5 container see: http://stackoverflow.com/a/19003725/274677
//@Singleton
// The above is commented as I am not using it in a JBoss deployment.


@Path("/main")
public class LoginResource {

    final static Logger logger = Logger.getLogger(LoginResource.class);

    private static AtomicInteger numberOfInstances = new AtomicInteger();

    public LoginResource(final ServletContext servletContext) {
        Assert.assertNotNull(servletContext);
        final int numberOfInstancesV = numberOfInstances.incrementAndGet();
        final int TOLERANCE = 5;  // a single instance of this class is returned from JaxRsApplication#getSingleton() so in a perfect world this would be set to 0 (zero tolerance) - this is to ensure that the singleton semantics are (somewhat) respected.
        final int MAX_EXPECTED_INSTANCES = 1 + TOLERANCE;
        Assert.assertTrue(String.format("[%d] instances of [%s] encountered. I was expecting at most [%d] (including a tolerance of [%d] over the rigid value of 1)"
                                        , numberOfInstancesV
                                        , MainResource.class.getName()
                                        , MAX_EXPECTED_INSTANCES
                                        , TOLERANCE)
                          , numberOfInstancesV <= MAX_EXPECTED_INSTANCES);

        logger.info(String.format("instance hashcode: [%s]"
                                  , System.identityHashCode(this)));
    }


    @Path("/login")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public final Response login(@Context javax.ws.rs.core.Application _app
                                , @Context final HttpServletRequest httpServletRequest
                                , String loginCredentialsJSON) {
        logger.info(String.format("/login POST JSON payload is %s"
                                  , loginCredentialsJSON));
        final LoginCredentials loginCredentials = GsonHelper.fromJson(loginCredentialsJSON
                                                                      , LoginCredentials.class);

        final String installation     = loginCredentials.installation;
        final String username         = loginCredentials.username;
        final String password         = loginCredentials.password;

        try {
            logger.info(String.format("login(%s, %s, %s) ~*~ remote address: [%s]"
                                      , installation
                                      , username
                                      , password
                                      , httpServletRequest.getRemoteAddr()));
            LoginResult loginResult;
            final JaxRsApplication app = (JaxRsApplication) _app;
            if (app.dbFacade.checkCredentials(installation, username, password))
                loginResult = new LoginResult(null, createAccessToken(installation, username));
            else
                loginResult = new LoginResult("login-fail", null);
            
            return Response.ok(GsonHelper.toJson(ValueOrInternalServerExceptionData.ok(loginResult))).build();
        } catch (Throwable t) {
            logger.error(String.format("Problem when calling login(%s, %s, %s) from remote address [%s]"
                                       , installation
                                       , username
                                       , password
                                       , httpServletRequest.getRemoteAddr())
                         , t);
            return ResourceUtil.softFailureResponse(t);
        }
    }

    @Path("/login/emailUsernameReminder")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public final Response emailUsernameReminder(@Context javax.ws.rs.core.Application _app
                                                , @Context final HttpServletRequest httpServletRequest
                                                , final String json) {
        final UsernameReminderPostRequest info = GsonHelper.fromJson(json
                                                                      , UsernameReminderPostRequest.class);        
        final String installation = info.installation;
        final String email = info.email;
        Assert.assertNotNull(installation);
        Assert.assertNotNull(email);
        try {
            logger.info(String.format("emailUsernameReminder(%s, %s) ~*~ remote address: [%s]"
                                      , installation
                                      , email
                                      , httpServletRequest.getRemoteAddr()));
            final JaxRsApplication app = (JaxRsApplication) _app;
            final String username = app.dbFacade.emailToUsername(installation, email);
            if (username != null)
                app.emailUsernameReminder(email, installation, username);
            
            final UsernameReminderResult result = new UsernameReminderResult(username==null?String.format("no username is found for installation [%s] and email [%s]"
                                                                                                          , installation
                                                                                                          , email)
                                                                             : (String) null);

            return Response.ok(GsonHelper.toJson(ValueOrInternalServerExceptionData.ok(result))).build();
        } catch (Throwable t) {
            logger.error(String.format("Problem when calling emailUsernameReminder(%s, %s) from remote address [%s]"
                                       , installation
                                       , json
                                       , httpServletRequest.getRemoteAddr())
                         , t);
            return ResourceUtil.softFailureResponse(t);
        }
    }    
    

    @Path("/login/resetPassword/emailConfirmationCode")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public final Response emailConfirmationCode(@Context javax.ws.rs.core.Application _app
                                , @Context final HttpServletRequest httpServletRequest
                                , String json) {
        logger.info(String.format("//login/resetPassword/emailConfirmationCode POST JSON payload is %s"
                                  , json));
        final PasswordResetEmailConfirmationCodeInfo info = GsonHelper.fromJson(json
                                                                      , PasswordResetEmailConfirmationCodeInfo.class);

        final String installation     = info.installation;
        final String username         = info.username;


        try {
            logger.info(String.format("emailConfirmationCode(%s, %s) ~*~ remote address: [%s]"
                                      , installation
                                      , username
                                      , httpServletRequest.getRemoteAddr()));
            PasswordResetEmailConfirmationCodeResult result;
            final JaxRsApplication app = (JaxRsApplication) _app;
            final String email = app.dbFacade.userEmail(installation, username);
            if (email == null)
                result = new PasswordResetEmailConfirmationCodeResult(false, (String) null, (Integer) null);
            else {
                final int validSecs = app.emailConfirmationCode(email);
                result = new PasswordResetEmailConfirmationCodeResult(true, email, validSecs);
            }
            
            return Response.ok(GsonHelper.toJson(ValueOrInternalServerExceptionData.ok(result))).build();
        } catch (Throwable t) {
            logger.error(String.format("Problem when calling emailConfirmationCode(%s, %s) from remote address [%s]"
                                       , installation
                                       , username
                                       , httpServletRequest.getRemoteAddr())
                         , t);
            return ResourceUtil.softFailureResponse(t);
        }
    }    

    private static final String createAccessToken(final String installation
                                                  , final String username) {
        /*    provenance of [secretKeyS]
         *
         *        ~/demo-spa-and-web-services-with-jwt-auth-type-01/console-utils/generate-secret-key
         */
        // must match the value in the rest-backend app
        final String secretKeySpecS = "eyJhbGdvcml0aG0iOiJIbWFjU0hBMjU2IiwiZW5jb2RlZEtleSI6InhUMzQ4ZWlXTmMvTVhoeE5ucXU5bG5ZUVBRdVB0WWlQbVM1UGpoc2wrY1FcdTAwM2QifQ==";
        final SecretKey secretKey = JWTUtil.stringToSecretKey(secretKeySpecS);
        return Jwts.builder()
            .setSubject(username)
            .claim(Installation.JWT_CLAIM, installation)
            .setExpiration(createExpirationDate())
            .signWith(secretKey).compact();
    }

    private static Date createExpirationDate() {
        final int VALIDITY_FOR_JWT_AUTHORIZATION_SECS = 30*60;
        final LocalDateTime x = LocalDateTime.now().plusSeconds(VALIDITY_FOR_JWT_AUTHORIZATION_SECS);
        final Date rv = Date.from( x.atZone( ZoneId.systemDefault()).toInstant() );
        return rv;
    }    
}

final class LoginResult {
    public final String loginFailureReason;
    public final String accessToken;

    public LoginResult(final String loginFailureReason, final String accessToken) {
        Assert.assertTrue( (loginFailureReason == null)
                           ||
                           (accessToken == null) );
        this.loginFailureReason = loginFailureReason;
        this.accessToken = accessToken;
    }
}

final class LoginCredentials {
    public String installation;
    public String username;
    public String password;
}

final class PasswordResetEmailConfirmationCodeInfo {
    public String installation;
    public String username;
}

final class PasswordResetEmailConfirmationCodeResult {
    public final boolean found;
    public final String value;
    public final Integer validSecs;

    public PasswordResetEmailConfirmationCodeResult(final boolean found
                                                    , final String value
                                                    , final Integer validSecs) {
        Assert.assertTrue( String.format("impossible combination (found, value, validSecs) = (%b, %s, %d)", found, value, validSecs)
                           , (found && value!=null && validSecs != null) || (!found && value==null && validSecs == null));
        this.found = found;
        this.value = value;
        this.validSecs = validSecs;
    }
}


final class UsernameReminderPostRequest {
    public String installation;
    public String email;
}

final class UsernameReminderResult {
    final String problem;
    public UsernameReminderResult(final String problem) {
        this.problem = problem;
    }
}
