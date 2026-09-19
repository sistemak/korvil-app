defmodule Kai.Api do
  use Phoenix.Controller
  @secret "kai-secret-elixir-2025"
  def login(conn, %{"email"=>email,"password"=>"kai123"}) do
    token = Phoenix.Token.sign(conn, "user auth", email)
    json(conn, %{token: token, status: "K-AI Elixir Online", neurons: 512})
  end
  def evolution(conn, _params) do
    json(conn, %{status: "K-AI Elixir Online", neurons: 512})
  end
end
IO.puts "K-AI Elixir Online - Phoenix Ready"