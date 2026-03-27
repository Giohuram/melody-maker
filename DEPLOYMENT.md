# 🚀 Déploiement sur Render avec Neon PostgreSQL

## 📋 Prérequis

- Compte Neon (https://neon.tech)
- Compte Render (https://render.com)
- Dépôt GitHub transféré vers votre compte

## 🔧 Étape 1: Configuration Neon

1. **Créez votre base de données Neon**
   ```bash
   # Connection string (à copier depuis Neon)
   DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-rapid-waterfall-al8gfke8.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

2. **Configurez le schéma**
   ```bash
   cd backend
   DATABASE_URL="votre-url-neon" npx tsx setup-db.js
   ```

## 🌐 Étape 2: Configuration Render

### Variables d'environnement sur Render

Dans le dashboard Render → votre service → Environment, ajoutez :

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-rapid-waterfall-al8gfke8.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=YOUR_JWT_SECRET
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
FRONTEND_URL=https://votre-app.onrender.com
```

### Configuration avec render.yaml

Le fichier `render.yaml` est déjà configuré pour :

- **Backend API** : Node.js sur port 3001
- **Frontend** : Statique avec réécriture d'URL
- **CORS** : Configuré pour votre domaine Render

## 🏗️ Étape 3: Déploiement

1. **Connectez Render à GitHub**
   - Allez sur https://render.com
   - Connectez votre compte GitHub
   - Importez `Giohuram/melody-maker`

2. **Configurez le service**
   - Utilisez le fichier `render.yaml`
   - Vérifiez les variables d'environnement
   - Déployez

3. **Vérifiez le déploiement**
   - Backend : `https://votre-app-api.onrender.com/api/health`
   - Frontend : `https://votre-app.onrender.com`

## 🔍 Tests post-déploiement

### API Health Check
```bash
curl https://votre-app-api.onrender.com/api/health
```

### Test d'authentification
```bash
curl -X POST https://votre-app-api.onrender.com/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token":"votre-google-token"}'
```

## 📊 Monitoring

- **Logs Render** : Dashboard → Logs
- **Metrics Neon** : Dashboard Neon
- **Performance** : Render Analytics

## 🔄 Mises à jour

Les pushs sur GitHub déclenchent automatiquement les redéploiements sur Render.

## 🐛 Dépannage

### Problèmes courants

1. **Erreur SSL Neon**
   - Vérifiez que `sslmode=require` est dans l'URL
   - Assurez-vous que `rejectUnauthorized: false` est configuré

2. **CORS errors**
   - Vérifiez `FRONTEND_URL` dans les variables d'environnement
   - Assurez-vous que le domaine est correct

3. **Database connection failed**
   - Vérifiez la `DATABASE_URL`
   - Assurez-vous que les tables sont créées

## 📝 Notes importantes

- Le SSL est requis pour Neon en production
- Les secrets ne doivent jamais être commités
- Utilisez toujours des variables d'environnement pour les credentials
