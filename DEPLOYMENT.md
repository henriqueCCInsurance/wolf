# The W.O.L.F. Den - Deployment Guide

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Development Server**
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

3. **Production Build**
```bash
npm run build
npm run preview
```

## Deployment Options

### Option 1: Static Hosting (Recommended)
The W.O.L.F. Den is a static web application that can be deployed to any static hosting service:

- **Netlify**: Connect your GitHub repository for automatic deployments
- **Vercel**: Optimized for React applications with Vite
- **GitHub Pages**: Free hosting for internal use
- **AWS S3 + CloudFront**: Enterprise-grade hosting

### Option 2: Internal Server
Deploy the built files to your internal web server:

1. Run `npm run build`
2. Copy the `dist/` folder to your web server
3. Configure your server to serve the files with proper MIME types

## Environment Configuration

No environment variables are required for the basic version. For future web search API integration, add:

```bash
# .env
VITE_SEARCH_API_KEY=your_api_key_here
VITE_SEARCH_API_URL=https://api.example.com
```

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Security Considerations

- All data is stored locally in the browser (localStorage)
- No sensitive information is transmitted over the network
- Mock web search service for demonstration purposes
- Production deployment should implement proper API authentication

## Performance

- Initial load: ~200KB (minified + gzipped)
- Fast route transitions with React Router
- Optimized Tailwind CSS with unused styles purged
- Lazy loading ready for future enhancements

## Monitoring

For production deployment, consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring (Web Vitals)

## Troubleshooting

### Common Issues

1. **Permission errors during npm install**
   ```bash
   sudo chown -R $(whoami) ~/.npm
   npm install
   ```

2. **Port 5173 already in use**
   ```bash
   npm run dev -- --port 3000
   ```

3. **Build fails with TypeScript errors**
   ```bash
   npm run typecheck
   ```

### Support

For technical issues or feature requests, contact the development team or create an issue in the project repository.

---

**Ready to transform your cold calling game with The W.O.L.F. Den!** 🐺