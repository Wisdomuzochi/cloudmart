# 🛒 CloudMart — Plateforme E-commerce Microservices

> Plateforme e-commerce complète en architecture microservices —
> Spring Boot · Angular · Kubernetes · Jenkins · Prometheus · Grafana

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-green)
![Angular](https://img.shields.io/badge/Angular-21-red)
![Kubernetes](https://img.shields.io/badge/Kubernetes-k3d-blue)
![Jenkins](https://img.shields.io/badge/Jenkins-CI/CD-brown)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)
![Tests](https://img.shields.io/badge/Tests-26_passing-brightgreen)

---

## 📌 C'est quoi CloudMart ?

CloudMart est une marketplace e-commerce de produits tech
découpée en microservices indépendants — comme Amazon ou Zalando
sous le capot.

Un client peut :
- Parcourir un catalogue de 100 produits variés
- S'inscrire, se connecter, gérer son profil
- Ajouter des produits au panier et passer commande
- Recevoir une confirmation automatique (RabbitMQ)
- Consulter l'historique de ses commandes

Un admin peut :
- Gérer le catalogue (ajout, modification, suppression)
- Consulter toutes les commandes

---

## 🏗️ Architecture

┌─────────────────────────────────────────────────────────┐
│                   Angular Frontend                      │
│         (catalogue, auth, panier, commandes, admin)     │
└─────────────────────────┬───────────────────────────────┘
│ HTTP /api
┌─────────────────────────▼───────────────────────────────┐
│              Spring Cloud Gateway :8090                 │
│         (routage, CORS, point d'entrée unique)          │
└──────┬──────────────┬──────────────┬────────────────────┘
│              │              │
┌──────▼──┐    ┌──────▼──┐    ┌──────▼──┐
│  User   │    │Product  │    │  Order  │
│ Service │    │ Service │    │ Service │
│  :8082  │    │  :8083  │    │  :8084  │
└──────┬──┘    └──────┬──┘    └──────┬──┘
│              │              │
┌──────▼──┐    ┌──────▼──┐    ┌──────▼──────────────────┐
│Postgres │    │ MongoDB │    │  Postgres + RabbitMQ    │
│  Users  │    │Products │    │  Orders + Messaging     │
└─────────┘    └─────────┘    └──────────┬──────────────┘
│ publie événement
┌──────────▼──────────────┐
│  Notification Service   │
│  (email de confirmation)│
└─────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│              Eureka Server :8761                        │
│         (Service Discovery — annuaire des services)     │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│         Prometheus :9090  +  Grafana :3000              │
│              (monitoring et observabilité)              │
└─────────────────────────────────────────────────────────┘

---

## 🛠️ Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Java 17 + Spring Boot 3.5 |
| API Gateway | Spring Cloud Gateway |
| Service Discovery | Netflix Eureka |
| Frontend | Angular 21 + TypeScript |
| Base de données | PostgreSQL + MongoDB |
| Messaging | RabbitMQ |
| Cache | Redis |
| Conteneurs | Docker + Docker Compose |
| Orchestration | Kubernetes (k3d) |
| CI/CD | Jenkins (pipeline Groovy) |
| Tests | JUnit 5 + Mockito (26 tests) |
| Monitoring | Prometheus + Grafana |
| IaC | Manifestes Kubernetes YAML |

---

## 🚀 Lancement rapide

### Prérequis

- Docker + Docker Compose
- Git
- Java 17 (pour le développement)
- Node.js 20 (pour le frontend)

### Option 1 — Docker Compose (recommandé)

```bash
# Clone le repo
git clone https://github.com/Wisdomuzochi/cloudmart.git
cd cloudmart

# Lance tout en une commande
cd infrastructure
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| API Gateway | http://localhost:8090 |
| Eureka Dashboard | http://localhost:8761 |
| RabbitMQ Dashboard | http://localhost:15672 |
| Jenkins | http://localhost:8888 |

### Option 2 — Kubernetes (k3d)

```bash
# Installe k3d
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Crée le cluster
k3d cluster create cloudmart --agents 1

# Charge les images
k3d image import cloudmart-eureka:latest -c cloudmart
k3d image import cloudmart-gateway:latest -c cloudmart
k3d image import cloudmart-user:latest -c cloudmart
k3d image import cloudmart-product:latest -c cloudmart
k3d image import cloudmart-order:latest -c cloudmart
k3d image import cloudmart-notification:latest -c cloudmart
k3d image import cloudmart-frontend:latest -c cloudmart

# Déploie
cd infrastructure/kubernetes
kubectl apply -f .

# Lance les port-forwards
kubectl port-forward service/frontend 8181:80 &
kubectl port-forward service/gateway 8090:8090 &
kubectl port-forward service/prometheus 9090:9090 &
kubectl port-forward service/grafana 3000:3000 &
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8181 |
| API Gateway | http://localhost:8090 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

---

## 🔐 Comptes par défaut

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@cloudmart.com | Admin123! |
| Client | à créer via /register | - |

---

## 📡 Endpoints API

---

## 🛠️ Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Java 17 + Spring Boot 3.5 |
| API Gateway | Spring Cloud Gateway |
| Service Discovery | Netflix Eureka |
| Frontend | Angular 21 + TypeScript |
| Base de données | PostgreSQL + MongoDB |
| Messaging | RabbitMQ |
| Cache | Redis |
| Conteneurs | Docker + Docker Compose |
| Orchestration | Kubernetes (k3d) |
| CI/CD | Jenkins (pipeline Groovy) |
| Tests | JUnit 5 + Mockito (26 tests) |
| Monitoring | Prometheus + Grafana |
| IaC | Manifestes Kubernetes YAML |

---

## 🚀 Lancement rapide

### Prérequis

- Docker + Docker Compose
- Git
- Java 17 (pour le développement)
- Node.js 20 (pour le frontend)

### Option 1 — Docker Compose (recommandé)

```bash
# Clone le repo
git clone https://github.com/Wisdomuzochi/cloudmart.git
cd cloudmart

# Lance tout en une commande
cd infrastructure
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| API Gateway | http://localhost:8090 |
| Eureka Dashboard | http://localhost:8761 |
| RabbitMQ Dashboard | http://localhost:15672 |
| Jenkins | http://localhost:8888 |

### Option 2 — Kubernetes (k3d)

```bash
# Installe k3d
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Crée le cluster
k3d cluster create cloudmart --agents 1

# Charge les images
k3d image import cloudmart-eureka:latest -c cloudmart
k3d image import cloudmart-gateway:latest -c cloudmart
k3d image import cloudmart-user:latest -c cloudmart
k3d image import cloudmart-product:latest -c cloudmart
k3d image import cloudmart-order:latest -c cloudmart
k3d image import cloudmart-notification:latest -c cloudmart
k3d image import cloudmart-frontend:latest -c cloudmart

# Déploie
cd infrastructure/kubernetes
kubectl apply -f .

# Lance les port-forwards
kubectl port-forward service/frontend 8181:80 &
kubectl port-forward service/gateway 8090:8090 &
kubectl port-forward service/prometheus 9090:9090 &
kubectl port-forward service/grafana 3000:3000 &
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8181 |
| API Gateway | http://localhost:8090 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

---

## 🔐 Comptes par défaut

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@cloudmart.com | Admin123! |
| Client | à créer via /register | - |

---

## 📡 Endpoints API

GET    /api/products              → liste des produits
GET    /api/products/{id}         → détail produit
GET    /api/products/category/{c} → par catégorie
GET    /api/products/search?name= → recherche
POST   /api/products              → créer produit (admin)
PUT    /api/products/{id}         → modifier produit
DELETE /api/products/{id}         → supprimer produit
POST   /api/users/register        → inscription
POST   /api/users/login           → connexion
GET    /api/users/{id}            → profil utilisateur
POST   /api/orders                → passer commande
GET    /api/orders/user/{id}      → commandes utilisateur
GET    /api/orders/{id}           → détail commande

---

## 🧪 Tests automatiques

```bash
# User Service (9 tests)
cd user-service && mvn test

# Product Service (10 tests)
cd product-service && mvn test

# Order Service (9 tests)
cd order-service && mvn test
```

**Total : 26 tests — tous au vert ✅**

Les tests couvrent :
- Création et validation des utilisateurs
- Encodage des mots de passe (BCrypt)
- CRUD complet des produits
- Calcul du montant des commandes
- Publication des événements RabbitMQ

---

## 🔄 Pipeline Jenkins CI/CD

À chaque push sur `main` :

push → Tests (26) → Build 7 images Docker → Rapport

✅ Tests User Service
✅ Tests Product Service
✅ Tests Order Service
✅ Build cloudmart-eureka
✅ Build cloudmart-gateway
✅ Build cloudmart-user
✅ Build cloudmart-product
✅ Build cloudmart-order
✅ Build cloudmart-notification
✅ Build cloudmart-frontend

---

## 📁 Structure du projet

cloudmart/
├── eureka-server/          ← Service Discovery
├── gateway/                ← API Gateway + CORS
├── user-service/           ← Auth + PostgreSQL
├── product-service/        ← Catalogue + MongoDB
├── order-service/          ← Commandes + RabbitMQ
├── notification-service/   ← Consumer événements
├── frontend/               ← Angular 21
├── infrastructure/
│   ├── docker-compose.yml  ← Orchestration locale
│   └── kubernetes/         ← Manifestes K8s
│       ├── eureka.yaml
│       ├── gateway.yaml
│       ├── user-service.yaml
│       ├── product-service.yaml
│       ├── order-service.yaml
│       ├── notification-service.yaml
│       ├── frontend.yaml
│       ├── postgres.yaml
│       ├── mongo.yaml
│       ├── rabbitmq.yaml
│       ├── prometheus.yaml
│       ├── grafana.yaml
│       └── prometheus-config.yaml
├── jenkins/
│   ├── Jenkinsfile         ← Pipeline CI/CD
│   └── Dockerfile          ← Jenkins custom
└── README.md

---

## ⚙️ Variables d'environnement

```env
POSTGRES_USER=cloudmart
POSTGRES_PASSWORD=cloudmart123
POSTGRES_DB=cloudmart_users
MONGO_INITDB_DATABASE=cloudmart_products
RABBITMQ_DEFAULT_USER=cloudmart
RABBITMQ_DEFAULT_PASS=cloudmart123
```

---

## 👤 Auteur

**MUONAKA Wisdom** — Étudiant Ingénieur ISTY Paris-Saclay (Bac+5)

[github.com/Wisdomuzochi](https://github.com/Wisdomuzochi) ·
[wisdomuzochi.github.io](https://wisdomuzochi.github.io) ·
[linkedin.com/in/wisdom-muonaka-45781b321](https://linkedin.com/in/wisdom-muonaka-45781b321)

