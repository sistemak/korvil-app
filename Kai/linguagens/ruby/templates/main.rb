require 'jwt'
require 'sinatra'
require 'json'
SECRET = 'kai-secret-ruby-2025'
set :port, 4567
post '/api/login' do
  data = JSON.parse(request.body.read)
  if data['email'] == 'kai@korvil.ai' && data['password'] == 'kai123'
    payload = {email: data['email'], exp: Time.now.to_i + 3600}
    token = JWT.encode(payload, SECRET, 'HS256')
    {token: token, status: 'K-AI Ruby Online'}.to_json
  else
    status 401; {error: 'Invalid'}.to_json
  end
end
get '/' do
  {status: 'K-AI Ruby Online', neurons: 512}.to_json
end