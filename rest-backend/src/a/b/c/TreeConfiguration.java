package a.b.c;

import java.util.LinkedHashMap;

public class TreeConfiguration {

    public TreeName name;
    public String layer;
    public String color;

    public TreeConfiguration(final TreeName name
                             , final String layer
                             , final String color) {
        this.name = name;
        this.layer = layer;
        this.color = color;
    }
}
