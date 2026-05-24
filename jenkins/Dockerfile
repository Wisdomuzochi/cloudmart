FROM jenkins/jenkins:lts

USER root

# Installer Docker CLI + Maven + gosu (pour drop de root vers jenkins)
RUN apt-get update -qq && \
    apt-get install -y -qq docker.io maven gosu && \
    rm -rf /var/lib/apt/lists/*

# Créer le groupe docker avec le GID du socket hôte (983)
# et ajouter jenkins dedans
RUN groupadd -g 983 docker 2>/dev/null || groupmod -g 983 docker && \
    usermod -aG docker jenkins

# Script d'entrée qui corrige les permissions du socket au démarrage
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Reste en root — l'entrypoint drop vers jenkins via gosu après chmod du socket
USER root

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
