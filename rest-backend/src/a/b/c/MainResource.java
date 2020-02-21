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
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;

import java.lang.reflect.Type;

import java.awt.image.BufferedImage;

import java.util.Base64;
import java.time.Instant;


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

import javax.imageio.ImageIO;

import org.junit.Assert;

import org.apache.log4j.Logger;

import a.b.gson.GsonHelper;

import javax.crypto.SecretKey;
import io.jsonwebtoken.Jwts;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.concurrent.TimeUnit;

import java.time.temporal.ChronoUnit;


// To support the Singleton annotation in a Tomcat 8.5 container see: http://stackoverflow.com/a/19003725/274677
//@Singleton
// The above is commented as I am not using it in a JBoss deployment.


@Path("/main")
public class MainResource {

    final static Logger logger = Logger.getLogger(MainResource.class);

    private static AtomicInteger numberOfInstances = new AtomicInteger();

    public MainResource(final ServletContext servletContext) {
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

    @Path("/foo")
    @GET 
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFeaturePhoto(@Context final HttpServletRequest httpServletRequest) {
        System.out.println("1");        
        return Response.ok(GsonHelper.toJson(ValueOrInternalServerExceptionData.ok("foobar"))).build();
    }


    @Path("/feature/{featureId}/photos/num")
    @GET 
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFeaturePhotosNum(@Context final HttpServletRequest httpServletRequest
                                        , @PathParam("featureId") final int featureId
                                    ) {
        try {
            logger.info(String.format("getFeaturePhotosNum(%d) ~*~ remote address: [%s]"
                                      , featureId
                                      , httpServletRequest.getRemoteAddr()));
            return Response.ok(GsonHelper.toJson(ValueOrInternalServerExceptionData.ok(5))).build();
        } catch (Throwable t) {
            logger.error(String.format("Problem when calling getFeaturePhotosNum(%d) from remote address [%s]"
                                       , featureId
                                       , httpServletRequest.getRemoteAddr())
                         , t);
            return ResourceUtil.softFailureResponse(t);
        }
    }
    

    @Path("/feature/{featureId}/photos/elem/{photoIndx}")
    @GET 
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFeaturePhoto(@Context final HttpServletRequest httpServletRequest
                                  , @PathParam("featureId") final int featureId
                                    , @PathParam("photoIndx") final int photoIndx
                                    ) {
        try {
            logger.info(String.format("getFeaturePhoto(%d, %d) ~*~ remote address: [%s]"
                                      , featureId
                                      , photoIndx
                                      , httpServletRequest.getRemoteAddr()));
            TimeUnit.MILLISECONDS.sleep(200);
            final String photoBase64 = getPhotoBase64(featureId);
            final Instant photoInstant = getPhotoInstant(featureId);
            final FeaturePhoto featurePhoto = new FeaturePhoto(photoBase64, photoInstant);
            return Response.ok(GsonHelper.toJson(ValueOrInternalServerExceptionData.ok(featurePhoto))).build();
        } catch (Throwable t) {
            logger.error(String.format("Problem when calling getFeaturePhoto(%d, %d) from remote address [%s]"
                                       , featureId
                                       , httpServletRequest.getRemoteAddr())
                         , t);
            return ResourceUtil.softFailureResponse(t);
        }
    }

    private Instant getPhotoInstant(final int featureid) {
        final int days = featureid % 2000;
        return Instant.now().minus(days, ChronoUnit.DAYS);
    }
    private String getPhotoBase64(final int featureid) throws Exception {
        final ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        final InputStream is = classloader.getResourceAsStream("photos/olive-3687482__340.jpg");
        final BufferedImage image = ImageIO.read(is);
        final ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "jpg", baos);
        final byte[] imageData = baos.toByteArray();
        return Base64.getEncoder().encodeToString(imageData);
    }
}



class FeaturePhoto {
    final String photoBase64;
    final Instant instant;
    protected FeaturePhoto(final String photoBase64, Instant instant) {
        this.photoBase64 = photoBase64;
        this.instant = instant;
    }

}


