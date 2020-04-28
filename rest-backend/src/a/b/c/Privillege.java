package a.b.c;

import java.util.Set;
import java.util.List;
import java.util.ArrayList;
import java.util.Collection;

import com.google.common.base.Joiner;

public enum Privillege {

    UPDATE_TREE_INFO("update-tree-info");

    private String code;

    private Privillege(final String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }


    public static Collection<String> toStrings(final Set<Privillege> privilleges) {
        final List<String> rv = new ArrayList<>();
        for (final Privillege privillege : privilleges) {
            rv.add(privillege.getCode());
        }
        return rv;
    }

    
}
