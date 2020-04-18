package a.b.c;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.LinkedHashMap;
import java.util.Random;

import org.junit.Assert;

public class DBFacade {

    private final Map<String, UserInfo> users;
    private final Map<Integer, TreeInfo> trees;
    private final Random r;
    
    public DBFacade() {
        this.users = new LinkedHashMap<String, UserInfo>();
        users.put("admin", new UserInfo("pass", "mperdikeas@gmail.com"));
        this.trees = new LinkedHashMap<>();
        this.r = new Random(0);
        final int NUM_OF_TREES = 60*1000;
        
        final double longAthens = 23.72;
        final double latAthens  = 37.98;
        final double widthOfCoverageInDegrees = 0.05;

        for (int i = 0; i < NUM_OF_TREES; i++) {
            final int heightCm = 100 + (int) r.nextInt(1900);
            final int crownHeightCm = (int) (heightCm * r.nextFloat() * 0.5);
            final int circumferenceCm = (int) (heightCm*0.1);
            Assert.assertNull(this.trees.put(i, new TreeInfo(i
                                                             , r.nextInt(30)
                                                             , new Coordinates(longAthens + (widthOfCoverageInDegrees*r.nextDouble()-widthOfCoverageInDegrees/2)
                                                                               , latAthens + (widthOfCoverageInDegrees*r.nextDouble()-widthOfCoverageInDegrees/2))
                                                             , 1950 + r.nextInt(70)
                                                             , HealthStatus.fromCode(r.nextInt(3)-1)
                                                             , heightCm
                                                             , crownHeightCm
                                                             , circumferenceCm
                                                             , r.nextBoolean()
                                                             , r.nextBoolean()
                                                             , r.nextBoolean()
                                                             , r.nextBoolean()
                                                             , r.nextBoolean()
                                                             , r.nextBoolean()
                                                             , r.nextBoolean()
                                                             , r.nextBoolean()
                                                             , r.nextBoolean()
                                                             , "yo! it's a tree"
                                                             )));
        } // for (int i = 0;

    }



    public boolean checkCredentials(final String installation, final String username, final String password) {
        if (!installation.equals("a1"))
            return false;
        final UserInfo userInfo = users.get(username);
        if (userInfo == null)
            return false;
        else
            return password.equals(userInfo.password);
    }

    public String userEmail(final String installation, final String username) {
        if (!installation.equals("a1"))
            return null;
        final UserInfo userInfo = users.get(username);
        if (userInfo == null)
            return (String) null;
        else
            return userInfo.email;
    }

    public String emailToUsername(final String installation, final String email) {
        for (final String username: users.keySet()) {
            if (users.get(username).email.equals(email))
                return username;
        }
        return null;
    }

    public BasicTreeInfo getBasicTreeInfo(final int treeId) {
        return this.trees.get(treeId);
    }


    public TreeInfo getTreeInfo(final int treeId) {
        return this.trees.get(treeId);
    }

    public List<BasicTreeInfo> getTrees(final String installation) {
        /* TODO: ignoring the installation value for this demo and returning *all*
         *       the trees in the database.
         */

        final List<TreeInfo> a = new ArrayList<TreeInfo>(this.trees.values());
        final List<BasicTreeInfo> b = a.stream().map(x -> x.toBasicTreeInfo()).collect(Collectors.toList());
        return b;
    }


}
