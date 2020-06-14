package a.b.c;

import java.lang.reflect.Method;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.LinkedHashMap;
import java.util.Random;
import java.util.Base64;
import java.util.Comparator;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.awt.image.BufferedImage;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;


import org.junit.Assert;

import a.b.c.SCAUtil;

public class DBFacade implements IDBFacade {

    private final Map<String, UserInfo> users;
    private final Map<Integer, TreeInfoWithId> trees;
    private final Map<Integer, Map<Integer, PhotoData>> tree2photos;

    private final Map<String, Map<String, List<Region>>> inst2partitions;
    private final Random r;
    
    public DBFacade() {
        this.users = new LinkedHashMap<String, UserInfo>();
        users.put("admin", new UserInfo("pass", "mperdikeas@gmail.com"));
        this.trees = new LinkedHashMap<>();
        this.tree2photos = new LinkedHashMap<>();
        this.r = new Random(0);
        final int NUM_OF_TREES = 10000;
        
        final double longAthens = 23.72;
        final double latAthens  = 37.98;
        final double widthOfCoverageInDegrees = 0.05;

        final List<PhotoData> allPhotos = allPhotos();
        for (int i = 0; i < NUM_OF_TREES; i++) {
            final int heightCm = 100 + (int) r.nextInt(1900);
            final int crownHeightCm = (int) (heightCm * r.nextFloat() * 0.5);
            final int circumferenceCm = (int) (heightCm*0.1);
            Assert.assertNull(this.trees.put(i, new TreeInfoWithId(i
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
                                                             , TreeAction.someRandomActions(r)
                                                             )));
            final int numOfPhotos = r.nextInt(7);
            final Map<Integer, PhotoData> photosForThisTree = new LinkedHashMap<>();
            for (int j = 0; j < numOfPhotos; j++) {
                Assert.assertNull(photosForThisTree.put(j, allPhotos.get(r.nextInt(30000) % allPhotos.size())));
            }
            Assert.assertNull(tree2photos.put(i, photosForThisTree));
        } // for (int i = 0;
        this.inst2partitions = new LinkedHashMap<>();
        final Map<String, List<Region>> partitionsA1 = new LinkedHashMap<>(); // partitions for installation 'a1'
        final List<Region> regionsA1_1 = new ArrayList<>(); // regions for the 1st partition of installation 'a1'
        regionsA1_1.add(new Region("a", "wkt-1"));
        regionsA1_1.add(new Region("b", "wkt-1"));
        regionsA1_1.add(new Region("c", "wkt-1"));
        regionsA1_1.add(new Region("d", "wkt-1"));
        regionsA1_1.add(new Region("e", "wkt-1"));
        regionsA1_1.add(new Region("f", "wkt-1"));
        regionsA1_1.add(new Region("g", "wkt-1"));
        regionsA1_1.add(new Region("h", "wkt-1"));
        regionsA1_1.add(new Region("i", "wkt-1"));

        final List<Region> regionsA1_2 = new ArrayList<>(); // regions for the 2nd partition of installation 'a1'
        regionsA1_2.add(new Region("aa", "wkt-1"));
        regionsA1_2.add(new Region("bb", "wkt-1"));
        regionsA1_2.add(new Region("cc", "wkt-1"));

        Assert.assertNull(partitionsA1.put("δ. διαμερίσματα", regionsA1_1));
        Assert.assertNull(partitionsA1.put("χωρικοί τομείς" , regionsA1_2));
        
        Assert.assertNull(this.inst2partitions.put("a1", partitionsA1));
    }

    private static List<PhotoData> allPhotos() {
        final List<PhotoData> rv = new ArrayList<>();
        final String[] photos = new String[]{
            "urban-olive-tree.jpeg",
            "olive-3687482__340.jpg",
            "olives-1752199__340.jpg", 
            "olive-tree-1973386__340.jpg", 
            "olive-tree-333973__340.jpg", 
            "olive-tree-3465274__340.jpg", 
            "olive-tree-3495165__340.jpg", 
            "olive-tree-3579922__340.jpg", 
            "olive-tree-3662627__340.jpg", 
            "olive-trees-4253749__340.jpg", 
            "photo-1445264718234-a623be589d37.jpeg", 
            "photo-1445294211564-3ca59d999abd.jpeg", 
            "photo-1446714276218-bd84d334af98.jpeg", 
            "photo-1471180625745-944903837c22.jpeg", 
            "photo-1476712395872-c2971d88beb7.jpeg", 
            "photo-1486162928267-e6274cb3106f.jpeg", 
            "photo-1489644484856-f3ddc0adc923.jpeg", 
            "photo-1496776574435-bf184935f729.jpeg", 
            "photo-1500215667712-fdbc1bfc0887.jpeg", 
            "photo-1501084291732-13b1ba8f0ebc.jpeg", 
            "photo-1502311526760-ebc5d6cc0183.jpeg", 
            "photo-1502770513380-138d6d3a51dd.jpeg", 
            "photo-1505672678657-cc7037095e60.jpeg", 
            "photo-1507369512168-9b7de6ec6be6.jpeg", 
            "photo-1508349937151-22b68b72d5b1.jpeg", 
            "photo-1523712999610-f77fbcfc3843.jpeg", 
            "photo-1541426062085-72349d82d048.jpeg", 
            "photo-1541623608922-3bce9d452968.jpeg", 
            "photo-1543130732-4b8da601004b.jpeg", 
            "photo-1545284860-c13569469d2a.jpeg", 
            "photo-1553755322-56baa43a31d7.jpeg", 
            "photo-1562207124-f93c6fc6c176.jpeg", 
            "photo-1563433571545-99e130f273f2.jpeg"
        };
        final Random r = new Random(0);
        for (final String fname: photos) {
            final ClassLoader classloader = Thread.currentThread().getContextClassLoader();
            final InputStream is = classloader.getResourceAsStream(String.format("photos/%s", fname));
            try {
                System.out.printf("about to read file %s\n", fname);
                final BufferedImage image = ImageIO.read(is);
                final ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(image, "jpg", baos);
                final byte[] imageData = baos.toByteArray();
                final String imageBase64 = Base64.getEncoder().encodeToString(imageData);
                final int days = r.nextInt() % 2000;
                final Instant instant = Instant.now().minus(days, ChronoUnit.DAYS); 
                rv.add(new PhotoData(imageBase64, instant));
            } catch (IOException e) {
                throw new RuntimeException(e);
            } finally {
                try {
                    is.close();
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
        }
        return rv;
    }


    @Override
    public boolean checkCredentials(final String installation, final String username, final String password) {
        if (!installation.equals("a1"))
            return false;
        final UserInfo userInfo = users.get(username);
        if (userInfo == null)
            return false;
        else
            return password.equals(userInfo.password);
    }

    @Override    
    public String userEmail(final String installation, final String username) {
        if (!installation.equals("a1"))
            return null;
        final UserInfo userInfo = users.get(username);
        if (userInfo == null)
            return (String) null;
        else
            return userInfo.email;
    }

    @Override
    public String emailToUsername(final String installation, final String email) {
        for (final String username: users.keySet()) {
            if (users.get(username).email.equals(email))
                return username;
        }
        return null;
    }
    
    @Override
    public BasicTreeInfoWithId getBasicTreeInfo(final int treeId) {
        return BasicTreeInfoWithId.from(this.trees.get(treeId));
    }


    @Override
    public TreeInfoWithId getTreeInfo(final int treeId) {
        return this.trees.get(treeId);
    }

    @Override
    public int createTree(TreeInfo treeInfo) {
        final int key = maxKeyInTrees() + 1;
        final TreeInfoWithId treeInfoWithId = new TreeInfoWithId(key, treeInfo);
        Assert.assertNull(this.trees.put(key, treeInfoWithId));


        final Map<Integer, PhotoData> photos = new LinkedHashMap<>();
        Assert.assertNull(this.tree2photos.put(key, photos));
        return key;
    }

    private int maxKeyInTrees() {
        return Collections.max(trees.entrySet(), Map.Entry.comparingByKey()).getKey();
    }

    @Override
    public boolean setTreeInfo(int treeId, TreeInfoWithId treeInfo) {
        final TreeInfoWithId oldValue = this.trees.put(treeId, treeInfo);
        return oldValue != null;
    }

    @Override
    public int getNumOfPhotos(int treeId) {
        return tree2photos.get(treeId).size();
    }

    @Override
    public PhotoData getPhoto(int treeId, int photoIdx) {
        return tree2photos.get(treeId).get(photoIdx);
    }

    @Override
    public int postPhoto(int treeId, PhotoData photoData) {
        final Map<Integer, PhotoData> photos = tree2photos.get(treeId);
        if (photos==null)
            tree2photos.put(treeId, new LinkedHashMap<>());
        final int nextKey = photos.keySet().isEmpty()?0:(Collections.max(photos.keySet())+1);
        Assert.assertNull(photos.put(nextKey, photoData));
        Assert.assertNotNull(tree2photos.put(treeId, photos));
        return nextKey;
    }

    @Override
    public boolean deletePhoto(int treeId, int photoIdx) {
        final Map<Integer, PhotoData> treePhotos = this.tree2photos.get(treeId);
        final PhotoData photoData = treePhotos.remove(photoIdx);
        final Map<Integer, PhotoData> treePhotosShifted = shiftToFillGaps(treePhotos);
        Assert.assertNotNull(this.tree2photos.put(treeId, treePhotosShifted));
        return photoData != null;
    }

    private static Map<Integer, PhotoData> shiftToFillGaps(final Map<Integer, PhotoData> treePhotos) {
        final Map<Integer, PhotoData> rv = new LinkedHashMap<>();
        final Set<Integer> photoIndexes = treePhotos.keySet();
        List<Integer> photoIndexesSorted = new ArrayList<>(photoIndexes);
        Collections.sort(photoIndexesSorted);
        int idx = 0;
        for (int i: photoIndexesSorted) {
            Assert.assertNull(rv.put(idx, treePhotos.get(i)));
            idx ++;
        }
        return rv;
    }

    @Override
    public List<BasicTreeInfoWithId> getTrees(final String installation) {
        /* TODO: ignoring the installation value for this demo and returning *all*
         *       the trees in the database.
         */

        final List<TreeInfoWithId> a = new ArrayList<TreeInfoWithId>(this.trees.values());
        final List<BasicTreeInfoWithId> b = a.stream().map(x -> x.toBasicTreeInfoWithId()).collect(Collectors.toList());
        return b;
    }

    @Override
    public final Set<Privillege> getPrivilleges(final String installation, final String username) {
        return new LinkedHashSet<Privillege>();
    }

    @Override    
    public final boolean arePrivillegesSufficient(Set<Privillege> privilleges, final Class c, final Method m) {
        if (c.equals(MainResource.class)) {
            try {
                final Method setFeatureData = MainResource.class.getMethod("setFeatureData"
                                                                           , javax.ws.rs.core.Application.class
                                                                           , javax.servlet.http.HttpServletRequest.class
                                                                           , int.class
                                                                           , String.class);
                if (m.equals(setFeatureData))
                    return true; // TODO
                else
                    return true;
            } catch (NoSuchMethodException e) {
                Assert.fail(e.getMessage());
                return SCAUtil.satisfyReturn(Boolean.class);
            }
        } else return true;
    }


    @Override    
    public final Map<String, List<Region>> partitionsForInstallation(final String installation) {
        final Map<String, List<Region>> rv = this.inst2partitions.get(installation);
        if (rv == null)
            return new LinkedHashMap<>();
        else
            return rv;
    }
    

}
