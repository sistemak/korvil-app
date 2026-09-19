import java.util.*; import java.time.Instant;
public class Main {
    static Map<String,String> users = Map.of("kai@korvil.ai","kai123");
    public static String generateToken(String email){
        return Base64.getEncoder().encodeToString((email+":"+Instant.now().toString()+":kai-secret").getBytes());
    }
    public static void main(String[] args){
        System.out.println("K-AI Java Online - JWT Auth Simulation");
        String email = "kai@korvil.ai";
        if(users.containsKey(email)){
            String token = generateToken(email);
            System.out.println("Login OK - Token: " + token);
            System.out.println("{\"status\":\"online\",\"neurons\":512,\"token\":\""+token+"\"}");
        }
    }
}