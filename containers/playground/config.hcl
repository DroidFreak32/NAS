storage "raft" {
  path    = "/secrets"
  node_id = "node1"
}

listener "tcp" {
  address     = "0.0.0.0:8299"
  tls_disable = "true"
}

disable_mlock = true

api_addr = "http://127.0.0.1:8299"
cluster_addr = "https://127.0.0.1:8298"
ui = true
