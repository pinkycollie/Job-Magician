# Job-Magician

**Deaf-First Vocational Rehabilitation and Workforce Development Intelligent Distributed System**

Part of the [360 Magicians](https://github.com/360magicians) ecosystem and [VR4Deaf](https://github.com/pinkycollie/vr4deaf) initiative.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![360 Magicians](https://img.shields.io/badge/360-Magicians-purple?style=for-the-badge)](https://github.com/360magicians)

## Overview

Job-Magician is a comprehensive vocational rehabilitation and workforce development platform designed with accessibility and inclusion at its core. This platform integrates with Texas Workforce Solutions to provide:

- **Vocational Rehabilitation Services**: Personalized career coaching and disability-focused employment services
- **Job Specialist Workflow**: Complete cycle from intake to placement and follow-up
- **Training & Development**: Skills assessment, certification programs, and job readiness training
- **Compliance**: Full adherence to WIOA, state, and federal workforce regulations

## Mission

As part of 360 Magicians, Job-Magician embodies a "Deaf-First" approach to workforce technology, ensuring:

1. **Accessibility by Design**: WCAG-compliant, visual-first interfaces
2. **Inclusive Innovation**: Built by and for the Deaf and disability communities
3. **Regulatory Compliance**: Aligned with Texas Workforce Commission standards and federal WIOA requirements
4. **Data Security**: Enterprise-grade privacy and security measures

## Features

### For Job Seekers
- Comprehensive skills assessment and career matching
- Personalized training plans and certifications
- Job search assistance and interview preparation
- Ongoing support and placement services
- Progress tracking and outcome monitoring

### For Employers
- Access to qualified candidates
- Workplace accommodation guidance
- Workforce development incentives
- Partnership opportunities

### For Service Providers
- Integrated case management
- Client progress dashboards
- Compliance tracking and reporting
- Resource coordination with Texas Workforce Solutions

## Tech Stack

### Frontend (Heavy Processes)
- **Framework**: Next.js 15.5+ (Standalone) with React 19
- **UI**: Tailwind CSS with Radix UI components
- **Language**: TypeScript
- **Build**: Next.js standalone output for production

### 360 Magicians Ecosystem Architecture
- **Primary Backend**: Deno-based (in progress)
- **Frontend Strategy**: Next.js for complex UI and heavier frontend processes
- **Integration**: Seamless interoperability between Deno backend and Next.js frontend

## Getting Started

### Prerequisites
- Node.js 18+ or compatible runtime
- pnpm (preferred) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/pinkycollie/VercelGuideline.git
cd VercelGuideline

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Build standalone output
npm run build

# Start production server
npm start

# Or use standalone output directly
node .next/standalone/server.js
```

### Deployment Options

Job-Magician is designed as a standalone application and can be deployed to:
- Self-hosted infrastructure
- Cloud platforms (AWS, Google Cloud, Azure)
- Container platforms (Docker, Kubernetes)
- Edge computing platforms

The application uses Next.js standalone output for optimal performance and minimal dependencies.

## Compliance & Standards

Job-Magician adheres to:

- **Workforce Innovation and Opportunity Act (WIOA)**: Federal workforce development requirements
- **Texas Workforce Commission**: State vocational rehabilitation standards
- **Americans with Disabilities Act (ADA)**: Equal employment opportunity provisions
- **WCAG 2.1 Level AA**: Web accessibility standards
- **HIPAA**: Protected health information safeguards where applicable
- **Section 508**: Federal accessibility requirements

## Security & Privacy

- End-to-end data encryption
- Role-based access control
- Regular security audits
- GDPR-compliant data handling
- Transparent privacy policies

## Related Projects

This platform is part of the larger 360 Magicians ecosystem:

- **[VR4Deaf](https://github.com/pinkycollie/vr4deaf)**: VR/AR accessibility platform
- **[PinkSync](https://github.com/pinkycollie/PinkSync)**: Visual-first workflow synchronization
- **[DeafAuth](https://github.com/pinkycollie/Nextjs-DeafAUTH)**: Accessible authentication system
- **[360 Magicians Platform](https://github.com/MBTQ-dev/Magician_Platform)**: Core AI agent ecosystem

## Contributing

We welcome contributions from the community! Please see our contributing guidelines and code of conduct.

## License

This project is open source. Please refer to the LICENSE file for details.

## Support

For questions, issues, or feedback:
- GitHub Issues: [Report an issue](https://github.com/pinkycollie/VercelGuideline/issues)
- Community: Join our discussions

## Acknowledgments

Built with support from:
- Texas Workforce Commission
- Vocational Rehabilitation Services
- The Deaf community and accessibility advocates
- 360 Magicians collective

---

**"Accessibility is not an afterthought—it's the foundation."**