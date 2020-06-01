package a.b.html;

public class NoBearerAuthHeaderException extends HeaderException {

    public NoBearerAuthHeaderException(final String context) {
        super((String) null, context);
    }

    @Override
    public String getMessage() {
        return String.format("no bearer authorization header was found - context: [%s]"
                             , context);
    }

}
