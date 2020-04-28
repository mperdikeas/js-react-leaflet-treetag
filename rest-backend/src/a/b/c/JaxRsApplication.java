package a.b.c;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.Arrays;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Random;

import java.io.UnsupportedEncodingException;

import java.lang.reflect.Method;

import javax.mail.MessagingException;
import javax.ws.rs.core.Application;

import javax.ws.rs.core.Context;
import javax.servlet.ServletContext;

import org.junit.Assert;

import org.apache.log4j.Logger;

import a.b.email.ISmtpMsa;
import a.b.email.ContainerConfiguredEmailSessionSmtpMsaImpl;

public class JaxRsApplication extends Application {

    private final Random r; 
    private final ISmtpMsa smtpMSA;
    protected IDBFacade dbFacade;
    
    final static Logger logger = Logger.getLogger(JaxRsApplication.class);
    
    private Set<Object> singletons = new HashSet<>();

    public JaxRsApplication(@Context ServletContext servletContext) {
        Assert.assertNotNull(servletContext);
        this.r = new Random();
        this.dbFacade = new DBFacade();

        final String emailSessionJndiName = ContextInitParameter.JNDI_NAME_FOR_EMAIL_SESSION.get(servletContext);
        Assert.assertNotNull(emailSessionJndiName);
        this.smtpMSA = new ContainerConfiguredEmailSessionSmtpMsaImpl(emailSessionJndiName);

        singletons.add( new MainResource  (servletContext) );
        singletons.add( new LoginResource (servletContext) );
        singletons.add( new CORSFilter() );

        {
            final Map<Class<?>, Set<Method>> guardedClassesAndMethods = GuardedClassesAndMethodsPreparer.getGuardedClassesAndMethods();
            singletons.add( new ValidJWSAccessTokenFilter(guardedClassesAndMethods
                                                          , logger) );

        }
    }

    public int emailConfirmationCode(final String email) {
        final int VALID_SECS = 300;
        final int confirmationCode = 100000 + (int) (r.nextFloat()*900000);
        logger.info(String.format("confirmation code is [%d]\n"
                                  , confirmationCode));
        logger.info(String.format("sending out email with confirmation code to: [%s]\n"
                                  , email));
        final String msg = String.format("Your confirmation code for password change is [%d]", confirmationCode);
        this.sendEmail(email, "password change confirmation code", msg, false);
        return VALID_SECS;
    }

    public void emailUsernameReminder(final String email
                                      , final String installation
                                      , final String username) {
        final String msg = String.format("The username at the TreeCadaster application associated with this email (%s) (for the '%s' installation) is: %s."
                                         , email
                                         , installation
                                         , username);
        this.sendEmail(email, "username reminder from the TreeCadster application", msg, false);
        logger.info(String.format("send username reminder to [%s]", email));
    }



    @Override
    public Set<Object> getSingletons() {
        return singletons;
    }

    public void sendEmail(String emailTo
                          , String subject
                          , String body
                          , boolean htmlEmail) {
        logger.info(String.format("sending email from [%s] to [%s] using container-configured email session"
                                  , Constants.FROM_EMAIL
                                  , emailTo));
        try {
            smtpMSA.post(Constants.FROM_EMAIL
                         , Constants.FROM_PERSONAL
                         , emailTo
                         , subject
                         , body
                         , htmlEmail);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}



