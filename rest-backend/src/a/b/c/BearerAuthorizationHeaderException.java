package a.b.c;


public final class BearerAuthorizationHeaderException extends Exception {

    public final BearerAuthorizationFailureMode mode;
    public final String msg;

    public BearerAuthorizationHeaderException(final BearerAuthorizationFailureMode mode
                                              , final String msg) {
        this.mode = mode;
        this.msg = msg;
    }

    

}
