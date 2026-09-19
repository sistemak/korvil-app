{-# LANGUAGE OverloadedStrings #-}
module Main where
import Data.Aeson
import qualified Data.ByteString.Lazy.Char8 as B

data Evolution = Evolution { status :: String, neurons :: Int }
instance ToJSON Evolution where
  toJSON (Evolution s n) = object ["status" .= s, "neurons" .= n]

generateToken :: String -> String
generateToken email = "kai-haskell-" ++ email ++ "-token"

main :: IO ()
main = do
  let evo = Evolution "K-AI Haskell Online" 512
  B.putStrLn $ encode evo
  putStrLn $ "Token: " ++ generateToken "kai@korvil.ai"