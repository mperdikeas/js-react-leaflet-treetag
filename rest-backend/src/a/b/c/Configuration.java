package a.b.c;

import java.util.LinkedHashMap;

public class Configuration {


    public LinkedHashMap<Integer, TreeConfiguration> treesConfiguration;
    public LinkedHashMap<Integer, String> healthStatuses;
    public LinkedHashMap<Integer, String> activities;


    public Configuration(final LinkedHashMap<Integer, TreeConfiguration> treesConfiguration
                         , final LinkedHashMap<Integer, String> healthStatuses
                         , final LinkedHashMap<Integer, String> activities) {
        this.treesConfiguration = treesConfiguration;
        this.healthStatuses = healthStatuses;
        this.activities = activities;
    }


    public static Configuration example() {
        final LinkedHashMap<Integer, TreeConfiguration> rv = new LinkedHashMap<>();
        {
            rv.put(1, new TreeConfiguration(new TreeName("ελιά", "ελιές")
                                            , "ελιές"
                                            , "#A1EB0E"));

            rv.put(2, new TreeConfiguration(new TreeName("ελιά κορωνέικη", "ελιές κορωνέικες")
                                            , "ελιές"
                                            , "#09DB0E"));
            rv.put(3, new TreeConfiguration(new TreeName("αγριελιά", "αγριελιές")
                                            , "ελιές"
                                            , "#07CB0E"));

            rv.put(10, new TreeConfiguration(new TreeName("μανταρινιά", "μανταρινιές")
                                             , "εσπεριδοειδή"
                                             , "#05CB0E"));
            rv.put(11, new TreeConfiguration(new TreeName("λεμονιά", "λεμονιές")
                                             , "εσπεριδοειδή"
                                             , "#04CB0E"));
            rv.put(12, new TreeConfiguration(new TreeName("νεραντζιά", "νεραντζιές")
                                             , "εσπεριδοειδή"
                                             , "#04CB0E"));
            rv.put(13, new TreeConfiguration(new TreeName("πορτοκαλιά", "πορτοκαλιές")
                                             , "εσπεριδοειδή"
                                             , "#04AB2E"));
            rv.put(14, new TreeConfiguration(new TreeName("βερυκοκιά", "βερυκοκιές")
                                             , "εσπεριδοειδή"
                                             , "#039B2E"));


            rv.put(15, new TreeConfiguration(new TreeName("ροδακινιά", "ροδακινιές")
                                             , "καρποφόρα"
                                             , "#039B2E"));
            rv.put(16, new TreeConfiguration(new TreeName("αμυγδαλιά", "αμυγδαλιές")
                                             , "καρποφόρα"
                                             , "#037B2E"));
            rv.put(16, new TreeConfiguration(new TreeName("μπανάνα", "μπανανιές")
                                             , "καρποφόρα"
                                             , "#033B2E"));
            rv.put(17, new TreeConfiguration(new TreeName("μηλιά", "μηλιές")
                                             , "καρποφόρα"
                                             , "#033B5E"));
            rv.put(18, new TreeConfiguration(new TreeName("καρυδιά", "καρυδιές")
                                             , "καρποφόρα"
                                             , "#033B8E"));
            rv.put(19, new TreeConfiguration(new TreeName("φουντουκιά", "φουντουκιές")
                                             , "καρποφόρα"
                                             , "#033B9E"));

            rv.put(20, new TreeConfiguration(new TreeName("πεύκο", "πεύκα")
                                             , "κωνοφώρα"
                                             , "#03999E"));                        
            rv.put(21, new TreeConfiguration(new TreeName("κυπαρίσσι", "κυπαρίσσια")
                                             , "κωνοφώρα"
                                             , "#03779E"));
            rv.put(22, new TreeConfiguration(new TreeName("αγριοκυπάρισο", "αγριοκυπάρισο")
                                             , "κωνοφώρα"
                                             , "#03449E"));
            rv.put(23, new TreeConfiguration(new TreeName("έλατο", "έλατα")
                                             , "κωνοφώρα"
                                             , "#FF449E"));

        
            rv.put(24, new TreeConfiguration(new TreeName("πλάτανος", "πλατάνια")
                                             , "διακοσμητικά"
                                             , "#11FF9E"));      
            rv.put(25, new TreeConfiguration(new TreeName("ευκάλυπτος", "ευκάλυπτοι")
                                             , "διακοσμητικά"
                                             , "#11FF00"));
            rv.put(26, new TreeConfiguration(new TreeName("φοίνικας αραβικός", "φοίνικες αραβικοί")
                                             , "διακοσμητικά"
                                             , "#3344FF"));
            rv.put(27, new TreeConfiguration(new TreeName("φοίνικας κυπριακός", "φοίνικες κυπριακοί")
                                             , "διακοσμητικά"
                                             , "#88EEFF"));
            rv.put(28, new TreeConfiguration(new TreeName("γιούκα", "γιούκες")
                                             , "διακοσμητικά"
                                             , "#00FFFF"));        
        }
        final LinkedHashMap<Integer, String> healthStatuses = new LinkedHashMap<>();
        {
            healthStatuses.put(-1, "poor");
            healthStatuses.put(0, "normal");
            healthStatuses.put(1, "good");
        }
        final LinkedHashMap<Integer, String> activities = new LinkedHashMap<>();
        {
            activities.put(0, "initial record");
            activities.put(1, "update");
            activities.put(2, "watering");
            activities.put(3, "medication");
            activities.put(4, "pruning");
            activities.put(5, "sidewalk repair");
            activities.put(6, "support");
            activities.put(7, "clear litter");
            activities.put(8, "address powerline proximity");
        }        
        return new Configuration(rv, healthStatuses, activities);
    }


}
