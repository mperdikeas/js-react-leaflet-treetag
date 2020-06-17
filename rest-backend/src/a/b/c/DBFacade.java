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
import org.apache.log4j.Logger;

import a.b.c.SCAUtil;

public class DBFacade implements IDBFacade {

    private final Map<String, UserInfo> users;
    private final Map<Integer, TreeInfoWithId> trees;
    private final Map<Integer, Map<Integer, PhotoData>> tree2photos;

    private final Map<String, Map<String, Map<String, Region>>> inst2partitions;
    private final Random r;

    final static Logger logger = Logger.getLogger(DBFacade.class);
    
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
        final Map<String, Map<String, Region>> partitionsA1 = new LinkedHashMap<>(); // partitions for installation 'a1'
        final Map<String, Region> regionsA1_1 = new LinkedHashMap<>(); // regions for the 1st partition of installation 'a1'
        // WKT polygons were created with: http://arthur-e.github.io/Wicket/sandbox-gmaps3.html
        regionsA1_1.put("a", new Region("a", "POLYGON((23.723053627152336 37.99535180007071,23.708805732865226 37.98425803533817,23.724598579544914 37.97708678267849,23.733009987015617 37.983310928925945,23.74556506841542 37.98723457590607,23.723424816011224 37.98304272798347,23.745397472261224 37.99805974450117,23.7220515249956 37.98642520711422,23.72926130282763 37.997789194822445,23.723053627152336 37.99535180007071))"));
        regionsA1_1.put("b", new Region("b", "POLYGON((23.716215038179193 37.99210742102543,23.728574657319818 37.99210742102543,23.728574657319818 37.9858840209316,23.716215038179193 37.9858840209316,23.716215038179193 37.99210742102543))"));
        regionsA1_1.put("c", new Region("c", "POLYGON((23.711923503755365 37.99954774989408,23.719648265718256 37.99954774989408,23.719648265718256 37.994542520831274,23.711923503755365 37.994542520831274,23.711923503755365 37.99954774989408))"));
        regionsA1_1.put("d", new Region("d", "POLYGON((23.723042919496894 38.00730849559171,23.713086559633613 37.992158087356486,23.73883576617658 37.99729875525109,23.723042919496894 38.00730849559171))"));
        regionsA1_1.put("e", new Region("e", "POLYGON((23.705504923619536 37.97243545389692,23.72661927298477 37.96512771085425,23.700011759557036 37.95457079791457,23.697780161656645 37.965939718223524,23.70739319876602 37.96702238074716,23.705504923619536 37.97243545389692))"));
        regionsA1_1.put("f", new Region("f", "POLYGON((23.690742045201567 37.959714098911604,23.716319590367583 37.9587666757903,23.685077219762114 37.947938115000916,23.690742045201567 37.959714098911604))"));
        regionsA1_1.put("g", new Region("g", "POLYGON((23.730779821781493 37.988704336374084,23.745242292789793 37.988704336374084,23.745242292789793 37.98552490915305,23.730779821781493 37.98552490915305,23.730779821781493 37.988704336374084))"));
        regionsA1_1.put("h", new Region("h", "POLYGON((23.727518255619383 37.98768964052812,23.728762800602293 37.98768964052812,23.728762800602293 37.978692056842156,23.727518255619383 37.978692056842156,23.727518255619383 37.98768964052812))"));
        regionsA1_1.put("i", new Region("i", "POLYGON((23.733225996403075 37.9799774934858,23.73704546204028 37.988230813392384,23.744255239872313 37.983495415483986,23.737689192203856 37.983630716808285,23.733225996403075 37.9799774934858))"));

        final Map<String, Region> regionsA1_2 = new LinkedHashMap<>(); // regions for the 2nd partition of installation 'a1'
        regionsA1_2.put("aa", new Region("aa", "POLYGON((23.708643985909557 37.991951268773214,23.716411663216686 37.991951268773214,23.716411663216686 37.98579550406773,23.708643985909557 37.98579550406773,23.708643985909557 37.991951268773214))"));
        regionsA1_2.put("bb", new Region("bb", "POLYGON((23.720145298165416 37.993980528544924,23.726711345833873 37.993980528544924,23.726711345833873 37.98139821305537,23.720145298165416 37.98139821305537,23.720145298165416 37.993980528544924))"));
        regionsA1_2.put("cc", new Region("cc", "POLYGON((23.685783381051117 37.991488910574596,23.67947482544809 37.98201822971525,23.690117830819183 37.985941945819036,23.693241054882314 37.98502180136414,23.693798954357412 37.98816742718586,23.69736092792919 37.995269957135335,23.690923626293447 37.990467369312086,23.68736165272167 37.997163848979184,23.685783381051117 37.991488910574596))"));

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

    // sse-1592215091
    @Override    
    public final Map<String, Map<String, Region>> partitionsForInstallation(final String installation) {
        final Map<String, Map<String, Region>> rv = this.inst2partitions.get(installation);
        if (rv == null)
            return new LinkedHashMap<>();
        else
            return rv;
    }

    @Override
    public final String putRegion(final String installation
                                  , final String partition
                                  , final String region
                                  , final String wkt) {
        logger.info(String.format("putRegion(%s, %s, %s, %s)"
                                  , installation
                                  , partition
                                  , region
                                  , wkt));
        final Map<String, Map<String, Region>> partition2regions = inst2partitions.get(installation);
        Assert.assertNotNull(partition2regions);
        final Map<String, Region> name2region = partition2regions.get(partition);
        Assert.assertNotNull(name2region);

        final Region prevRegion = name2region.put(region, new Region(region, wkt));
        Assert.assertNotNull(partition2regions.put(partition, name2region));
        Assert.assertNotNull(inst2partitions.put(installation, partition2regions));
        String prevWKT = null;
        if (prevRegion == null)
            prevWKT = null;
        else
            prevWKT = prevRegion.wkt;
        return prevWKT;
    }
    

}
