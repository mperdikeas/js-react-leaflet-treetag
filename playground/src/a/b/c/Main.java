    // https://stackoverflow.com/q/61289314/274677
    package a.b.c;
    
    import com.google.gson.Gson;
    import com.google.gson.GsonBuilder;

    import java.lang.reflect.Type;
    import com.google.gson.reflect.TypeToken;

    import org.junit.Assert;
    
    
    
    class A {
        public int a;
        public A(final int a) {
            this.a = a;
        }
    }
    
    class B extends A {
        public int b;
    
        public B(final int a, final int b) {
            super(a);
            this.b = b;
        }
    }

    class Holder<T> {
        public final T t;

        public Holder(final T t) {
            this.t = t;
        }
    }
    
    public class Main {
    
        public static void main(String args[]) {

            {
                final A a = new B(42, 142);
                final Gson gson = new GsonBuilder().serializeNulls().create();

                final Type TYPE= new TypeToken<A>() {}.getType();
                final String s1 = gson.toJson(a, TYPE);
                final String s2 = gson.toJson(a, A.class);
                Assert.assertEquals(s1, s2);
                System.out.printf("%s\n", s1);
            }

            {
                final A a = new B(42, 142);
                final Holder<A> holder = new Holder<A>(a);
                final Gson gson = new GsonBuilder().serializeNulls().create();

                final Type TYPE= new TypeToken<Holder<A>>() {}.getType();
                final String s = gson.toJson(holder, TYPE);
                System.out.printf("%s\n", s);
            }            
        }
    }
