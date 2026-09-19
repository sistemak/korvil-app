import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import java.util.Date

fun main(){
    val secret = "kai-secret-kotlin-2025"
    val algo = Algorithm.HMAC256(secret)
    val token = JWT.create()
        .withClaim("email","kai@korvil.ai")
        .withExpiresAt(Date(System.currentTimeMillis()+3600000))
        .sign(algo)
    println("K-AI Kotlin Online - JWT: $token")
    println("{\"status\":\"K-AI Kotlin\",\"neurons\":512}")
}