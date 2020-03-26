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
        kind2name.put(2, new TreeName("ελιά κορωνέικη", "ελιές κορωνέικες"));
        kind2name.put(3, new TreeName("αγριελιά", "αγριελιές"));

        kind2name.put(10, new TreeName("μανταρινιά", "μανταρινιές"));
        kind2name.put(11, new TreeName("λεμονιά", "λεμονιές"));
        kind2name.put(12, new TreeName("νεραντζιά", "νεραντζιές"));
        kind2name.put(13, new TreeName("πορτοκαλιά", "πορτοκαλιές"));
        kind2name.put(14, new TreeName("βερυκοκιά", "βερυκοκιές"));

        kind2name.put(15, new TreeName("αμυγδαλιά", "αμυγδαλιές"));
        kind2name.put(16, new TreeName("μπανάνα", "μπανανιές"));
        kind2name.put(17, new TreeName("μηλιά", "μηλιές"));
        kind2name.put(18, new TreeName("καρυδιά", "καρυδιές"));
        kind2name.put(19, new TreeName("φουντουκιά", "φουντουκιές"));


        
        kind2name.put(20, new TreeName("πεύκο", "πεύκα"));
        kind2name.put(21, new TreeName("κυπαρίσσι", "κυπαρίσσια"));
        kind2name.put(22, new TreeName("αγριοκυπάρισο", "αγριοκυπάρισο"));
        kind2name.put(23, new TreeName("έλατο", "έλατα"));

        kind2name.put(24, new TreeName("πλάτανος", "πλατάνια"));
        kind2name.put(25, new TreeName("ευκάλυπτος", "ευκάλυπτοι"));
        kind2name.put(26, new TreeName("φοίνικας αραβικός", "φοίνικες αραβικοί"));
        kind2name.put(27, new TreeName("φοίνικας Κύπρου", "φοίνικες κυπριακοί"));        
        kind2name.put(28, new TreeName("γιούκα", "γιούκες"));

        final LinkedHashMap<Integer, String> kind2layer = new LinkedHashMap<>();
        kind2layer.put(1, "ελιές");
        kind2layer.put(2, "ελιές");
        kind2layer.put(3, "ελιές");

        kind2layer.put(10, "εσπεριδοειδή");
        kind2layer.put(11, "εσπεριδοειδή");
        kind2layer.put(12, "εσπεριδοειδή");
        kind2layer.put(13, "εσπεριδοειδή");
        kind2layer.put(14, "εσπεριδοειδή");

        kind2layer.put(15, "καρποφόρα");
        kind2layer.put(16, "καρποφόρα");
        kind2layer.put(17, "καρποφόρα");
        kind2layer.put(18, "καρποφόρα");
        kind2layer.put(19, "καρποφόρα");        



        kind2layer.put(20, "κωνοφώρα");
        kind2layer.put(21, "κωνοφώρα");
        kind2layer.put(22, "κωνοφώρα");
        kind2layer.put(23, "κωνοφώρα");


        kind2layer.put(24, "διακοσμητικά");
        kind2layer.put(25, "διακοσμητικά");
        kind2layer.put(26, "διακοσμητικά");
        kind2layer.put(27, "διακοσμητικά");
        kind2layer.put(28, "διακοσμητικά");


        final LinkedHashMap<Integer, String> kind2color = new LinkedHashMap<>();
        kind2color.put(1, "#A1EB0E");
        kind2color.put(2, "#EB0EB5");
        kind2color.put(3, "#DA2A07");
        kind2color.put(4, "#A1EB0E");
        kind2color.put(5, "#EB0EB5");
        kind2color.put(6, "#DA2A07");
        kind2color.put(7, "#A1EB0E");
        kind2color.put(8, "#EB0EB5");
        kind2color.put(9, "#DA2A07");
        kind2color.put(10, "#A1EB0E");
        kind2color.put(11, "#EB0EB5");
        kind2color.put(12, "#DA2A07");
        kind2color.put(13, "#DA2A07");
        kind2color.put(14, "#DA2A07");
        kind2color.put(15, "#DA2A07");
        kind2color.put(16, "#DA2A07");
        kind2color.put(17, "#DA2A07");
        kind2color.put(18, "#DA2A07");
        kind2color.put(19, "#DA2A07");
        kind2color.put(20, "#DA2A07");
        kind2color.put(21, "#DA2A07");
        kind2color.put(22, "#DA2A07");
        kind2color.put(23, "#DA2A07");
        kind2color.put(24, "#DA2A07");
        kind2color.put(25, "#DA2A07");
        kind2color.put(26, "#DA2A07");
        kind2color.put(27, "#DA2A07");
        kind2color.put(28, "#DA2A07");
        kind2color.put(29, "#DA2A07");
        kind2color.put(30, "#DA2A07");

        return new TreesConfiguration(kind2name, kind2layer, kind2color);
    }


}
