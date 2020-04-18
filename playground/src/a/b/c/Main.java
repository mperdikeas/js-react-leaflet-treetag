    // https://stackoverflow.com/q/61289314/274677
    package a.b.c;
    
    import com.google.gson.Gson;
    import com.google.gson.GsonBuilder;
    
    
    
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
    
    public class Main {
    
        public static void main(String args[]) {
    
            final A a = new B(42, 142);
            final Gson gson = new GsonBuilder().serializeNulls().create();
    
            System.out.printf("%s\n", gson.toJson(a));
            
    
    
        }
    
    }
