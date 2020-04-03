package a.b.email;


// SMTP Message Submission Agent

/* For this client using GMail make sure you enable "Access for less secure apps" in your Google
   account as explained here:

    http://stackoverflow.com/a/31919138/274677

    So basically go here:
        https://www.google.com/settings/security/lesssecureapps

    ... and enable access for less secure apps. Just make sure you are logged in at the right
    Gmail account when you do so.
 */
public class GMailSMTP extends SmtpMsaImpl {

    public GMailSMTP(String _username, String _password) {
        super("smtp.gmail.com", 587, _username, _password);
    }
}
