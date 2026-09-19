use std::collections::HashMap;
use serde::{Serialize, Deserialize};

#[derive(Serialize)]
struct Evolution { status: String, neurons: u32, level: String }

fn generate_token(email: &str) -> String {
    format!("kai-rust-{}-{}", email, chrono::Utc::now().timestamp())
}

fn main(){
    let mut caps: HashMap<String, bool> = HashMap::new();
    caps.insert("criar_api".to_string(), true);
    caps.insert("evoluir".to_string(), true);
    let evo = Evolution { status: "K-AI Rust Online".to_string(), neurons: 512, level: "autonomous".to_string() };
    println!("{}", serde_json::to_string_pretty(&evo).unwrap());
    println!("Token: {}", generate_token("kai@korvil.ai"));
}