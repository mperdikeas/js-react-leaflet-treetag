package a.b.html;

import org.junit.Assert;

public class MoreThanOneHeaderFoundException extends HeaderException {

    public final int numFound;


    public MoreThanOneHeaderFoundException(final String header, final String context, final int numFound) {
        super(header, context);
        this.numFound = numFound;
    }

    @Override
    public String getMessage() {
        return String.format("[%d] headers of type [%s] were found - only one was expected!"
                             , numFound
                             , header);
    }
}
