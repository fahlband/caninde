# PostgreSQL 16 com PostGIS. A imagem oficial postgis/postgis não tem build arm64
# para a versão 16, então instalamos a extensão sobre a imagem oficial do postgres.
FROM postgres:16

RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-16-postgis-3 \
    && rm -rf /var/lib/apt/lists/*
