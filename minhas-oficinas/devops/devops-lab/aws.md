## ✅ Visão geral do processo

Subir para a AWS significa migrar de um **Minikube local** para um **cluster Kubernetes gerenciado**, geralmente o **Amazon EKS (Elastic Kubernetes Service)**.

---

## 🧱 Etapas principais

### 1. **Publicar a imagem da aplicação**

Antes de qualquer coisa, a aplicação precisa estar acessível via Docker Registry:

#### 👉 Push da imagem para o Docker Hub ou Amazon ECR:

**Docker Hub (mais simples para testes):**

```bash
docker build -t luismarchio0303/node-k8s-app:latest .
docker push luismarchio0303/node-k8s-app:latest
```

**Amazon ECR (produção):**

```bash
aws ecr create-repository --repository-name node-k8s-app

# Autenticar no ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com

# Build e push
docker tag node-k8s-app:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/node-k8s-app:latest
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/node-k8s-app:latest
```

---

### 2. **Criar um cluster EKS (Amazon Elastic Kubernetes Service)**

Existem duas formas:

#### 🚀 **Fácil e rápida (recomendada): usar o `eksctl`**

```bash
eksctl create cluster --name node-app-cluster --region us-east-1 --nodes 2 --node-type t3.medium
```

✅ Isso cria:

* Um cluster Kubernetes gerenciado
* EC2s como workers
* Auto config no kubeconfig

#### Alternativa: via console da AWS (manual, menos escalável)

---

### 3. **Configurar o `kubectl` para se conectar ao EKS**

Após o cluster criado, configure:

```bash
aws eks update-kubeconfig --region us-east-1 --name node-app-cluster
```

Verifique:

```bash
kubectl get nodes
```

---

### 4. **Aplicar seus manifests do Kubernetes no EKS**

Atualize seu `deployment.yaml` para referenciar a imagem correta (ex: do Docker Hub ou ECR) e depois:

```bash
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
```

---

### 5. **Expor a aplicação na internet**

#### ⚠️ **O Minikube usa NodePort**, mas na AWS você quer **LoadBalancer**:

Atualize seu `service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-app-service
spec:
  selector:
    app: node-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

E reaplique:

```bash
kubectl apply -f kubernetes/service.yaml
```

⚠️ Leva alguns minutos para o **ELB (Elastic Load Balancer)** ser criado.

Verifique com:

```bash
kubectl get svc
```

Você verá um `EXTERNAL-IP` apontando para o endpoint público da AWS.

---

## 📦 Estrutura de produção ideal

```
infra/
├── eksctl-cluster.yaml   # (infra as code opcional)
app/
├── Dockerfile
├── deployment.yaml
├── service.yaml
```

---

## 💡 Bônus: CI/CD com GitHub Actions + EKS

Você pode integrar GitHub Actions com:

* Push da imagem para ECR
* Deploy automático no EKS

Posso montar um `.github/workflows/deploy.yml` se quiser.

---

## 🧠 Conclusão

Subir sua app do Minikube para a AWS exige 3 fundamentos:

1. Uma imagem acessível publicamente (Docker Hub ou ECR)
2. Um cluster Kubernetes real (EKS)
3. Um service com `type: LoadBalancer` para exposição na nuvem

Se quiser, posso te guiar **passo a passo** para automatizar tudo com `eksctl`, `kubectl`, ECR e GitHub Actions. Deseja esse pipeline CI/CD na prática?
