package a.b.c;

import java.util.LinkedHashMap;

public class TreesConfiguration {


    public LinkedHashMap<Integer, TreeName> kind2name;

    public LinkedHashMap<Integer, String> kind2layer;

    public LinkedHashMap<Integer, String> kind2color;

    public TreesConfiguration(LinkedHashMap<Integer, TreeName> kind2name
                             , LinkedHashMap<Integer, String> kind2layer
                             , LinkedHashMap<Integer, String> kind2color) {
        this.kind2name = kind2name;
        this.kind2layer = kind2layer;
        this.kind2color = kind2color;
    }


    public static TreesConfiguration example() {
        final LinkedHashMap<Integer, TreeName> kind2name = new LinkedHashMap<>();
        kind2name.put(1, new TreeName("ελιά", "ελιές"));
        kind2name.put(2, new TreeName("πεύκο", "πεύκα"));
        kind2name.put(2, new TreeName("κυπαρίσσι", "κυπαρίσσια"));

        final LinkedHashMap<Integer, String> kind2layer = new LinkedHashMap<>();
        kind2layer.put(1, "ελιές");
        kind2layer.put(2, "κωνοφώρα");
        kind2layer.put(3, "κωνοφώρα");

        final LinkedHashMap<Integer, String> kind2color = new LinkedHashMap<>();
        kind2color.put(1, "#A1EB0E");
        kind2color.put(1, "#EB0EB5");
        kind2color.put(1, "#DA2A07");

        return new TreesConfiguration(kind2name, kind2layer, kind2color);
    }


}
