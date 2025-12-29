# Deployment Checklist

## Pre-Deployment Preparation

### Environment Configuration
- [ ] Create production `.env` file with all required variables
- [ ] Generate strong JWT_SECRET_KEY (32+ characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database connection string
- [ ] Update CORS origin to production frontend URL
- [ ] Set production Cloudinary credentials
- [ ] Set production Paystack secret key (live key, not test)
- [ ] Configure `CLIENT_URL` environment variable

### Code Review
- [ ] All tests passing
- [ ] No console.log statements in production code
- [ ] Error handling properly configured
- [ ] Security middleware in place
- [ ] Rate limiting configured
- [ ] CSRF protection enabled

### Database
- [ ] Database indexes created
- [ ] Database backup strategy in place
- [ ] Connection pooling configured
- [ ] Database user has minimal required permissions
- [ ] Test database connection from production environment

### Security
- [ ] HTTPS certificate configured
- [ ] Security headers middleware enabled
- [ ] Sensitive data not exposed in error messages
- [ ] JWT token expiration appropriate
- [ ] Password policies enforced
- [ ] Input sanitization enabled

## Deployment Steps

### 1. Server Setup
- [ ] Server provisioned (recommended: 2GB RAM minimum)
- [ ] Node.js installed (v18+ recommended)
- [ ] MongoDB installed or cloud database configured
- [ ] Process manager installed (PM2 recommended)
- [ ] Firewall configured (allow only necessary ports)
- [ ] SSL/TLS certificate installed

### 2. Code Deployment
- [ ] Clone repository to production server
- [ ] Install dependencies: `npm install --production`
- [ ] Copy `.env` file to server
- [ ] Verify file permissions (no world-readable secrets)

### 3. Process Management
- [ ] Configure PM2 ecosystem file:
  ```javascript
  module.exports = {
    apps: [{
      name: 'vendora-backend',
      script: './server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      }
    }]
  }
  ```
- [ ] Start application: `pm2 start ecosystem.config.js`
- [ ] Enable startup script: `pm2 startup`
- [ ] Save process list: `pm2 save`

### 4. Reverse Proxy (Nginx)
- [ ] Install Nginx
- [ ] Configure Nginx:
  ```nginx
  server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
      proxy_pass http://localhost:8000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_cache_bypass $http_upgrade;
    }
  }
  ```
- [ ] Test Nginx config: `nginx -t`
- [ ] Reload Nginx: `systemctl reload nginx`
- [ ] Configure SSL with Let's Encrypt

### 5. Monitoring Setup
- [ ] Configure PM2 monitoring
- [ ] Set up log rotation
- [ ] Configure error alerting
- [ ] Set up uptime monitoring
- [ ] Database monitoring enabled

## Post-Deployment Verification

### Functional Tests
- [ ] Health check endpoint responding
- [ ] User registration works
- [ ] User login works
- [ ] JWT authentication working
- [ ] File upload working (Cloudinary)
- [ ] Payment initialization works (Paystack)
- [ ] Webhook endpoint accessible
- [ ] Email notifications working (if applicable)
- [ ] Database queries performing well

### Security Tests
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Security headers present in responses
- [ ] CORS properly configured
- [ ] Rate limiting functional
- [ ] CSRF protection working
- [ ] SQL/NoSQL injection tests passed
- [ ] XSS protection verified

### Performance Tests
- [ ] Response times acceptable (<200ms for simple queries)
- [ ] Database queries optimized
- [ ] No memory leaks detected
- [ ] Server CPU usage normal
- [ ] Database connections pooled properly

### Error Handling
- [ ] 404 errors handled gracefully
- [ ] 500 errors logged but not exposing details
- [ ] Database connection errors handled
- [ ] Payment errors handled properly
- [ ] File upload errors handled

## Monitoring & Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor server resources (CPU, RAM, disk)
- [ ] Verify backup completion
- [ ] Check payment webhook logs

### Weekly
- [ ] Review application logs for anomalies
- [ ] Check database performance metrics
- [ ] Review security logs
- [ ] Monitor API response times

### Monthly
- [ ] Update dependencies
- [ ] Review and rotate secrets if needed
- [ ] Database optimization (if needed)
- [ ] Review access logs
- [ ] Update documentation

## Rollback Plan

### If Deployment Fails
1. [ ] Stop new application: `pm2 stop vendora-backend`
2. [ ] Restore previous version from git
3. [ ] Restore previous `.env` if changed
4. [ ] Restart application: `pm2 restart vendora-backend`
5. [ ] Verify old version working
6. [ ] Investigate and fix issues
7. [ ] Document what went wrong

## Emergency Contacts

- **DevOps Lead**: [Contact Info]
- **Backend Lead**: [Contact Info]
- **Database Admin**: [Contact Info]
- **Security Team**: [Contact Info]

## Useful Commands

```bash
# View logs
pm2 logs vendora-backend

# Restart application
pm2 restart vendora-backend

# Monitor resources
pm2 monit

# Check status
pm2 status

# View specific number of log lines
pm2 logs vendora-backend --lines 100

# Database backup
mongodump --uri="mongodb://..." --out=/backup/path

# Database restore
mongorestore --uri="mongodb://..." /backup/path
```

## Environment Variables Reference

See `.env.example` for complete list. Required variables:
- `NODE_ENV=production`
- `PORT=8000`
- `CONNECTION_URI` - MongoDB connection string
- `JWT_SECRET_KEY` - Strong secret (32+ chars)
- `CLOUDINARY_NAME` - Cloudinary account name
- `CLOUDINARYAPI_KEY` - Cloudinary API key
- `CLOUDINARYAPI_API_SECRET` - Cloudinary secret
- `PAYSTACK_TEST_SECRET_KEY` - For test/staging
- Production should use `PAYSTACK_SECRET_KEY` (live key)
- `CLIENT_URL` - Frontend URL for CORS

## Post-Deployment Notes

Document any issues encountered and resolutions:

Date: ___________
Issue: ___________
Resolution: ___________
