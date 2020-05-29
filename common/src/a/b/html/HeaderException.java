package a.b.html;

public abstract class HeaderException extends Exception {

    public final String header;
    public final String context;


    public HeaderException(final String header, final String context) {
        this.header = header;
        this.context = context;
    }
}
