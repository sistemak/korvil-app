#include <iostream>
#include <string>
#include <map>
#include <chrono>
std::string generateToken(std::string email){
    auto now = std::chrono::system_clock::now().time_since_epoch().count();
    return "kai-cpp-" + email + "-" + std::to_string(now);
}
int main(){
    std::map<std::string, std::string> users = {{"kai@korvil.ai","kai123"}};
    std::cout << "K-AI C++ Online\n";
    std::string email = "kai@korvil.ai";
    if(users.count(email)){
        std::string token = generateToken(email);
        std::cout << "Token: " << token << "\n";
        std::cout << "{\"status\":\"online\",\"neurons\":512}\n";
    }
    return 0;
}