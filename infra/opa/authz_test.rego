# Testes das regras de autorização. Execute com: opa test infra/opa -v
package envoy.authz_test

import rego.v1

import data.envoy.authz

request(method, path, roles) := {"attributes": {
	"request": {"http": {"method": method, "path": path}},
	"metadataContext": {"filterMetadata": {"envoy.filters.http.jwt_authn": {"payload": {"realm_access": {"roles": roles}}}}},
}}

test_health_publico if {
	authz.allow with input as request("GET", "/api/v1/health", [])
}

test_busca_publica_sem_token if {
	authz.allow with input as request("GET", "/api/v1/search?q=barbearia", [])
}

test_admin_com_papel_platform_admin if {
	authz.allow with input as request("GET", "/api/v1/admin/companies", ["platform_admin"])
}

test_admin_negado_para_empresa if {
	not authz.allow with input as request("GET", "/api/v1/admin/companies", ["empresa"])
}

test_rota_autenticada_para_empresa if {
	authz.allow with input as request("POST", "/api/v1/companies/claim", ["empresa"])
}

test_rota_protegida_sem_papel_negada if {
	not authz.allow with input as request("POST", "/api/v1/companies/claim", [])
}
