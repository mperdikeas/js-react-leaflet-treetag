package a.b.email;

import java.util.Properties;

import javax.mail.Session;
import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;




// SMTP Message Submission Agent
public class SmtpMsaImpl extends SmtpMsaSessionAgnosticBase {

    private final String host;
    private final int    port;
    private final String username;
    private final String password;

    public SmtpMsaImpl(String _host, int _port, String _username, String _password) {
        this.host     = _host;
        this.port     = _port;
        this.username = _username;
        this.password = _password;
    }

    @Override
    protected Session getSession() {
        Properties props = System.getProperties();
        // Setup mail server
        props.setProperty("mail.smtp.auth"           , "true");
        props.setProperty("mail.smtp.starttls.enable", "true");
        props.setProperty("mail.smtp.host"           , this.host);
        props.setProperty("mail.smtp.port"           , Integer.toString(this.port));
        Session session = Session.getInstance(props,
                                              new Authenticator() {
                                                  protected PasswordAuthentication getPasswordAuthentication() {
                                                      return new PasswordAuthentication(username
                                                                                      , password);
                                                  }
                                              });
        return session;
    }
}
