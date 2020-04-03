package a.b.email;


import javax.naming.InitialContext;
import javax.naming.NamingException;

import javax.mail.Session;



import org.junit.Assert;

// SMTP Message Submission Agent
public class ContainerConfiguredEmailSessionSmtpMsaImpl extends SmtpMsaSessionAgnosticBase {

    private final String jndiName;

    public ContainerConfiguredEmailSessionSmtpMsaImpl(String jndiName) {
        this.jndiName = jndiName;
    }

    @Override
    protected Session getSession() {
        try {
            InitialContext ic = new InitialContext();
            Session session = (Session)ic.lookup(this.jndiName);
            Assert.assertNotNull(session);
            return session;
        } catch (NamingException e) {
            throw new RuntimeException(e);
        }
    }
}
