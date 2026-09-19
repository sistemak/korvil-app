local jwt = require "resty.jwt"
local secret = "kai-secret-lua-2025"
local payload = { email="kai@korvil.ai", exp=os.time()+3600 }
local token = jwt:sign(secret, { header={typ="JWT", alg="HS256"}, payload=payload })
print("K-AI Lua Online - Token: " .. token)
print('{"status":"K-AI Lua","neurons":512}')
-- OpenResty handler
-- content_by_lua_block { ngx.say('{"status":"K-AI Lua"}') }