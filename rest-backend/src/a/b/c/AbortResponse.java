package a.b.c;

final class AbortResponse {
    public final BearerAuthorizationFailureMode code;
    public final String msg;
    public final String details;
    public AbortResponse(final BearerAuthorizationFailureMode code 
                         , final String msg
                         , final String details) {
        this.code = code;
        this.msg = msg;
        this.details = details;
    }
}
