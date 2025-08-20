#!/bin/bash

# Portfolio Builder Deployment Script

set -e

echo "🚀 Starting Portfolio Builder Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to deploy with Docker Compose
deploy_docker() {
    echo "📦 Deploying with Docker Compose..."
    
    # Stop any existing containers
    echo "🛑 Stopping existing containers..."
    docker-compose down 2>/dev/null || true
    
    # Build and start containers
    echo "🔨 Building and starting containers..."
    docker-compose up -d --build
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    echo "🔍 Checking service health..."
    
    # Check backend
    if curl -f http://localhost:8080/api/portfolio/list >/dev/null 2>&1; then
        echo "✅ Backend is healthy"
    else
        echo "❌ Backend health check failed"
        docker-compose logs backend
        exit 1
    fi
    
    # Check frontend
    if curl -f http://localhost:4200 >/dev/null 2>&1; then
        echo "✅ Frontend is healthy"
    else
        echo "❌ Frontend health check failed"
        docker-compose logs frontend
        exit 1
    fi
    
    echo "🎉 Deployment successful!"
    echo "🌐 Frontend: http://localhost:4200"
    echo "🔧 Backend API: http://localhost:8080"
    echo "🗄️ Database: localhost:3306"
}

# Function to deploy to Kubernetes
deploy_kubernetes() {
    echo "☸️ Deploying to Kubernetes..."
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        echo "❌ kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    # Apply Kubernetes manifests
    echo "📋 Applying Kubernetes manifests..."
    kubectl apply -f k8s/namespace.yaml
    kubectl apply -f k8s/mysql.yaml
    kubectl apply -f k8s/backend.yaml
    kubectl apply -f k8s/frontend.yaml
    
    echo "⏳ Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/mysql-deployment -n portfolio-builder
    kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment -n portfolio-builder
    kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment -n portfolio-builder
    
    # Get service URLs
    echo "🔍 Getting service information..."
    kubectl get services -n portfolio-builder
    
    echo "🎉 Kubernetes deployment successful!"
}

# Function to clean up
cleanup() {
    echo "🧹 Cleaning up..."
    if [ "$1" == "docker" ]; then
        docker-compose down -v
        docker system prune -f
    elif [ "$1" == "kubernetes" ]; then
        kubectl delete namespace portfolio-builder
    fi
    echo "✅ Cleanup completed"
}

# Main deployment logic
case "$1" in
    "docker")
        deploy_docker
        ;;
    "kubernetes"|"k8s")
        deploy_kubernetes
        ;;
    "cleanup")
        cleanup "$2"
        ;;
    *)
        echo "Usage: $0 {docker|kubernetes|cleanup}"
        echo ""
        echo "Commands:"
        echo "  docker      - Deploy using Docker Compose (recommended for local)"
        echo "  kubernetes  - Deploy to Kubernetes cluster"
        echo "  cleanup     - Clean up deployment (specify docker or kubernetes)"
        echo ""
        echo "Examples:"
        echo "  $0 docker"
        echo "  $0 kubernetes"
        echo "  $0 cleanup docker"
        exit 1
        ;;
esac
