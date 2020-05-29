package a.b.html;

public class AuthHeaderExceptionMoreThanOneBearerToken extends HeaderException {

    public final Integer n;

    public AuthHeaderExceptionMoreThanOneBearerToken(final String header
                                                     , final String context
                                                     , final Integer n) {
        super(header, context);
        this.n = n;
    }

    @Override
    public String getMessage() {
        return String.format("more than one bearer tokens in this auth header: [%s]", header);
    }    
}
