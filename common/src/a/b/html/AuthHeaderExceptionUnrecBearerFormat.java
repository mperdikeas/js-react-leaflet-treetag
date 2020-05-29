package a.b.html;

public class AuthHeaderExceptionUnrecBearerFormat extends HeaderException {

    public AuthHeaderExceptionUnrecBearerFormat(final String header, final String context) {
        super(header, context);
    }

    @Override
    public String getMessage() {
        return String.format("unrecognized bearer format in this auth header: [%s]", header);
    }

}
