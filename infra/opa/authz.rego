# Autorização por rota (ADR-0004). O Envoy envia a requisição e as claims do JWT validado.
package envoy.authz

import rego.v1

default allow := false

# Claims do JWT, disponíveis pelo filtro jwt_authn do Envoy.
claims := input.attributes.metadataContext.filterMetadata["envoy.filters.http.jwt_authn"].payload

# Papéis do realm no Keycloak. Requisições sem token não têm papéis.
roles contains role if {
	some role in claims.realm_access.roles
}

method := input.attributes.request.http.method

# Caminho sem query string, separado em segmentos. Ex.: ["api", "v1", "admin", "companies"].
segments := [s | some s in split(split(input.attributes.request.http.path, "?")[0], "/"); s != ""]

# Rotas públicas.
allow if {
	method == "GET"
	segments == ["api", "v1", "health"]
}

allow if {
	method == "GET"
	segments == ["api", "v1", "search"]
}

# Administração da plataforma exige o papel platform_admin.
allow if {
	array.slice(segments, 0, 2) == ["api", "v1"]
	segments[2] == "admin"
	"platform_admin" in roles
}

# Demais rotas autenticadas exigem qualquer papel conhecido (exceto admin, tratado acima).
allow if {
	array.slice(segments, 0, 2) == ["api", "v1"]
	segments[2] != "admin"
	some role in {"gestor_prefeitura", "empresa", "consumidor"}
	role in roles
}
