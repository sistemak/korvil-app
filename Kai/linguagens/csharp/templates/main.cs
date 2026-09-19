using System; using System.IdentityModel.Tokens.Jwt; using System.Security.Claims; using System.Text; using Microsoft.IdentityModel.Tokens;
class Program {
    static void Main(){
        Console.WriteLine("K-AI C# Online");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("kai-secret-key-very-long-32-chars!"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(claims: new[]{new Claim("email","kai@korvil.ai")}, expires: DateTime.Now.AddHours(1), signingCredentials: creds);
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        Console.WriteLine($"JWT: {jwt}");
        Console.WriteLine("{\"status\":\"K-AI C#\",\"neurons\":512}");
    }
}