package a.b.c;

import java.util.LinkedHashMap;

public class Configuration {


    public LinkedHashMap<Integer, TreeConfiguration> species;
    public HealthStatuses healthStatuses;
    public LinkedHashMap<Integer, String> activities;


    public Configuration(final LinkedHashMap<Integer, TreeConfiguration> species
                         , final HealthStatuses healthStatuses
                         , final LinkedHashMap<Integer, String> activities) {
        this.species = species;
        this.healthStatuses = healthStatuses;
        this.activities = activities;
    }


    public static Configuration example() {
        final LinkedHashMap<Integer, TreeConfiguration> species = new LinkedHashMap<>();
        {
            species.put(1, new TreeConfiguration(new TreeName("ελιά", "ελιές")
                                            , "ελιές"
                                            , "#A1EB0E"));

            species.put(2, new TreeConfiguration(new TreeName("ελιά κορωνέικη", "ελιές κορωνέικες")
                                            , "ελιές"
                                            , "#09DB0E"));
            species.put(3, new TreeConfiguration(new TreeName("αγριελιά", "αγριελιές")
                                            , "ελιές"
                                            , "#07CB0E"));

            species.put(10, new TreeConfiguration(new TreeName("μανταρινιά", "μανταρινιές")
                                             , "εσπεριδοειδή"
                                             , "#05CB0E"));
            species.put(11, new TreeConfiguration(new TreeName("λεμονιά", "λεμονιές")
                                             , "εσπεριδοειδή"
                                             , "#04CB0E"));
            species.put(12, new TreeConfiguration(new TreeName("νεραντζιά", "νεραντζιές")
                                             , "εσπεριδοειδή"
                                             , "#04CB0E"));
            species.put(13, new TreeConfiguration(new TreeName("πορτοκαλιά", "πορτοκαλιές")
                                             , "εσπεριδοειδή"
                                             , "#04AB2E"));
            species.put(14, new TreeConfiguration(new TreeName("βερυκοκιά", "βερυκοκιές")
                                             , "εσπεριδοειδή"
                                             , "#039B2E"));


            species.put(15, new TreeConfiguration(new TreeName("ροδακινιά", "ροδακινιές")
                                             , "καρποφόρα"
                                             , "#039B2E"));
            species.put(16, new TreeConfiguration(new TreeName("αμυγδαλιά", "αμυγδαλιές")
                                             , "καρποφόρα"
                                             , "#037B2E"));
            species.put(16, new TreeConfiguration(new TreeName("μπανάνα", "μπανανιές")
                                             , "καρποφόρα"
                                             , "#033B2E"));
            species.put(17, new TreeConfiguration(new TreeName("μηλιά", "μηλιές")
                                             , "καρποφόρα"
                                             , "#033B5E"));
            species.put(18, new TreeConfiguration(new TreeName("καρυδιά", "καρυδιές")
                                             , "καρποφόρα"
                                             , "#033B8E"));
            species.put(19, new TreeConfiguration(new TreeName("φουντουκιά", "φουντουκιές")
                                             , "καρποφόρα"
                                             , "#033B9E"));

            species.put(20, new TreeConfiguration(new TreeName("πεύκο", "πεύκα")
                                             , "κωνοφώρα"
                                             , "#03999E"));                        
            species.put(21, new TreeConfiguration(new TreeName("κυπαρίσσι", "κυπαρίσσια")
                                             , "κωνοφώρα"
                                             , "#03779E"));
            species.put(22, new TreeConfiguration(new TreeName("αγριοκυπάρισο", "αγριοκυπάρισο")
                                             , "κωνοφώρα"
                                             , "#03449E"));
            species.put(23, new TreeConfiguration(new TreeName("έλατο", "έλατα")
                                             , "κωνοφώρα"
                                             , "#FF449E"));

        
            species.put(24, new TreeConfiguration(new TreeName("πλάτανος", "πλατάνια")
                                             , "διακοσμητικά"
                                             , "#11FF9E"));      
            species.put(25, new TreeConfiguration(new TreeName("ευκάλυπτος", "ευκάλυπτοι")
                                             , "διακοσμητικά"
                                             , "#11FF00"));
            species.put(26, new TreeConfiguration(new TreeName("φοίνικας αραβικός", "φοίνικες αραβικοί")
                                             , "διακοσμητικά"
                                             , "#3344FF"));
            species.put(27, new TreeConfiguration(new TreeName("φοίνικας κυπριακός", "φοίνικες κυπριακοί")
                                             , "διακοσμητικά"
                                             , "#88EEFF"));
            species.put(28, new TreeConfiguration(new TreeName("γιούκα", "γιούκες")
                                             , "διακοσμητικά"
                                             , "#00FFFF"));        
        }
        final LinkedHashMap<Integer, String> _healthStatuses = new LinkedHashMap<>();
        {
            _healthStatuses.put(-1, "poor");
            _healthStatuses.put(0, "normal");
            _healthStatuses.put(1, "good");
        }
        final HealthStatuses healthStatuses = new HealthStatuses(_healthStatuses);
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
        return new Configuration(species, healthStatuses, activities);
    }


}
