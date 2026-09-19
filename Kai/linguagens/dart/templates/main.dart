import 'dart:io';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';

void main(){
  final jwt = JWT({'email':'kai@korvil.ai','exp': DateTime.now().add(Duration(hours:1)).millisecondsSinceEpoch ~/1000});
  final token = jwt.sign(SecretKey('kai-secret-dart-2025'));
  print('K-AI Dart Online - Token: $token');
  HttpServer.bind('0.0.0.0', 8080).then((server){
    print('Listening http://localhost:8080');
    server.listen((req){
      req.response..write('{"status":"K-AI Dart","token":"$token"}')..close();
    });
  });
}