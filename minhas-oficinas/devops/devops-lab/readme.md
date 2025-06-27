* **Node.js** como aplicação.
* **Docker** para containerizar.
* **Minikube** para simular um cluster Kubernetes local.
* **LocalStack** para simular serviços da AWS como S3, Lambda, etc.

---

## ✅ Visão Geral do Projeto

### 📦 Arquitetura:

```text
[Node.js App] → [Docker] → [Minikube Cluster] → [AWS Services via LocalStack]
```

---

## 📁 Estrutura de Diretórios

```bash
devops-lab/
│
├── app/                 # Código-fonte Node.js
│   ├── index.js
│   └── package.json
│
├── Dockerfile           # Imagem da aplicação
├── kubernetes/
│   ├── deployment.yaml
│   └── service.yaml
│
├── localstack/
│   └── docker-compose.yml
│
└── README.md            # Documentação do projeto
```

---

## 1️⃣ Criar App Node.js

### 📄 `app/index.js`

```js
// Servidor básico com Express para simular uma API
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Node.js running in Kubernetes!');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
```

### 📄 `app/package.json`

```json
{
  "name": "node-k8s-localstack",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

## 2️⃣ Dockerizar o App

### 📄 `Dockerfile`

```Dockerfile
# Usa imagem Node.js oficial
FROM node:20-alpine

# Cria diretório para o app
WORKDIR /app

# Copia arquivos
COPY ./app .

# Instala dependências
RUN npm install

# Expõe a porta usada pelo Express
EXPOSE 3000

# Comando para rodar o app
CMD ["npm", "start"]
```

---

## 3️⃣ Subir o LocalStack

### 📄 `localstack/docker-compose.yml`

```yaml
version: '3.8'

services:
  localstack:
    image: localstack/localstack
    container_name: localstack
    ports:
      - "4566:4566"     # Porta principal de acesso à API
      - "4571:4571"     # Porta legacy
    environment:
      - SERVICES=s3,lambda,cloudwatch,logs
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
    volumes:
      - "./.localstack:/tmp/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
```

> 📌 Comando:

```bash
docker-compose -f localstack/docker-compose.yml up -d
```

---

## 4️⃣ Build da Imagem Docker

```bash
docker build -t node-k8s-app .
```

> `-t` = tag da imagem para facilitar uso no Kubernetes.

---

## 5️⃣ Iniciar Minikube com suporte ao Docker local

```bash
minikube start --driver=docker

minikube stop
minikube delete
minikube start --driver=docker
```

> Isso cria um cluster K8s com o Docker embutido.

---

## 6️⃣ Subir Imagem Docker no Minikube

```bash
eval $(minikube docker-env)
docker build -t node-k8s-app .
```

> `eval` redireciona builds Docker locais para o daemon Docker do Minikube.

---

## 7️⃣ Criar Arquivos Kubernetes

### 📄 `kubernetes/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
      - name: node-app
        image: node-k8s-app
        ports:
        - containerPort: 3000
```

### 📄 `kubernetes/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-app-service
spec:
  type: NodePort
  selector:
    app: node-app
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30036  # Porta exposta para acesso externo
```

---

## 8️⃣ Aplicar no Minikube

```bash
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
```

---

## 9️⃣ Acessar a Aplicação

```bash
minikube service node-app-service

kubectl get pods

docker pull node-k8s-app

docker build -t luismarchio0303/node-k8s-app:latest .
docker push luismarchio0303/node-k8s-app:latest

kubectl apply -f kubernetes/deployment.yaml

docker build -t node-k8s-app:latest .


```

> Isso abre o browser com o IP e porta do serviço no cluster local.

---

## 🔟 Testar Integração com LocalStack (Ex: S3)

Crie um bucket:

```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://meu-bucket-local
```

Faça upload de um arquivo:

```bash
echo "arquivo local" > file.txt
aws --endpoint-url=http://localhost:4566 s3 cp file.txt s3://meu-bucket-local/
```

---

## ✅ Resultado Esperado

Você terá:

* Um app Node.js containerizado rodando em Kubernetes.
* Um ambiente local simulando AWS (S3, Lambda, etc.).
* Tudo rodando 100% local — ideal para testes, CI/CD, estudos e simulações de ambientes cloud-native.

---

## 🔁 Próximos Passos (Recomendado)

1. Adicionar acesso a serviços da LocalStack via SDK AWS dentro do app.
2. Criar Lambda fake para simular triggers de eventos.
3. Automatizar com GitHub Actions + minikube-local (workflow de CI/CD).

---

Se quiser, eu posso gerar um repositório de exemplo com tudo isso pronto, incluindo o `README.md` documentado e comentado. Deseja que eu prepare isso?
