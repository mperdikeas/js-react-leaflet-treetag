package a.b.html;

public class NoHeaderFoundException extends HeaderException {


    public NoHeaderFoundException(final String header, final String context) {
        super(header, context);
    }

    @Override
    public String getMessage() {
        return String.format("No header of type [%s] was found. Context is: [%s]"
                             , header
                             , context);
    }

}
