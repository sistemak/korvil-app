import Foundation
import JWTKit

struct Payload: JWTPayload {
    var email: String
    var exp: ExpirationClaim
    func verify(using signer: JWTSigner) throws { try exp.verifyNotExpired() }
}

let secret = "kai-secret-swift-2025"
let signer = JWTSigner.hs256(key: Data(secret.utf8))
let payload = Payload(email: "kai@korvil.ai", exp: .init(value: Date().addingTimeInterval(3600)))
let token = try! signer.sign(payload)
print("K-AI Swift Online - Token: \(token)")
print("{\"status\":\"K-AI Swift\",\"neurons\":512}")