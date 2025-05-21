"use client"

import type React from "react"

import { useState } from "react"
import {
  UserCheck,
  FileSpreadsheet,
  GraduationCap,
  Briefcase,
  ArrowRightCircle,
  Users,
  LineChart,
  Award,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type CycleStep = {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

export function JobSpecialistCycle() {
  const [activeStep, setActiveStep] = useState(1)

  const cycleSteps: CycleStep[] = [
    {
      id: 1,
      title: "Client Intake",
      description: "Initial assessment and registration of clients into the system",
      icon: <UserCheck className="h-10 w-10 text-primary" />,
    },
    {
      id: 2,
      title: "Skills Assessment",
      description: "Evaluate client skills, experience, and career goals",
      icon: <FileSpreadsheet className="h-10 w-10 text-primary" />,
    },
    {
      id: 3,
      title: "Training & Development",
      description: "Personalized training plans and skill development",
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
    },
    {
      id: 4,
      title: "Job Matching",
      description: "Connect clients with suitable employment opportunities",
      icon: <Briefcase className="h-10 w-10 text-primary" />,
    },
    {
      id: 5,
      title: "Employer Engagement",
      description: "Building relationships with potential employers",
      icon: <Users className="h-10 w-10 text-primary" />,
    },
    {
      id: 6,
      title: "Placement & Follow-up",
      description: "Job placement and ongoing support services",
      icon: <Award className="h-10 w-10 text-primary" />,
    },
    {
      id: 7,
      title: "Outcome Tracking",
      description: "Monitoring success metrics and client progress",
      icon: <LineChart className="h-10 w-10 text-primary" />,
    },
  ]

  const handleNext = () => {
    setActiveStep((prev) => (prev === cycleSteps.length ? 1 : prev + 1))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-8">
        {cycleSteps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all
              ${activeStep === step.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
            onClick={() => setActiveStep(step.id)}
          >
            <div
              className={`rounded-full p-2 mb-2 ${activeStep === step.id ? "bg-primary-foreground/20" : "bg-background"}`}
            >
              {step.icon}
            </div>
            <p className={`text-sm font-medium ${activeStep === step.id ? "text-primary-foreground" : ""}`}>
              {step.title}
            </p>
          </div>
        ))}
      </div>

      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle>{cycleSteps[activeStep - 1].title}</CardTitle>
          <CardDescription>
            Step {activeStep} of {cycleSteps.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{cycleSteps[activeStep - 1].description}</p>

          <div className="flex flex-col space-y-4">
            <h4 className="font-medium">Key Activities:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {activeStep === 1 && (
                <>
                  <li>Initial client registration and data collection</li>
                  <li>Eligibility determination for Texas Workforce programs</li>
                  <li>Documentation of employment barriers and needs</li>
                  <li>Assignment to appropriate job specialist</li>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <li>Comprehensive skills and aptitude testing</li>
                  <li>Career interest inventory assessment</li>
                  <li>Previous work history analysis</li>
                  <li>Identification of transferable skills</li>
                </>
              )}
              {activeStep === 3 && (
                <>
                  <li>Customized training plan development</li>
                  <li>Referrals to educational resources and programs</li>
                  <li>Soft skills and job readiness workshops</li>
                  <li>Digital literacy and technical skills training</li>
                </>
              )}
              {activeStep === 4 && (
                <>
                  <li>Matching client profiles with job requirements</li>
                  <li>Identification of suitable positions in job database</li>
                  <li>Resume tailoring for specific opportunities</li>
                  <li>Interview preparation and coaching</li>
                </>
              )}
              {activeStep === 5 && (
                <>
                  <li>Outreach to potential employers</li>
                  <li>Hosting job fairs and networking events</li>
                  <li>Educating employers about workforce incentives</li>
                  <li>Developing partnerships for ongoing placement</li>
                </>
              )}
              {activeStep === 6 && (
                <>
                  <li>Facilitating job interviews and placements</li>
                  <li>Providing on-the-job support services</li>
                  <li>Addressing workplace accommodation needs</li>
                  <li>Regular check-ins during initial employment period</li>
                </>
              )}
              {activeStep === 7 && (
                <>
                  <li>Collecting employment retention data</li>
                  <li>Measuring client satisfaction and outcomes</li>
                  <li>Analyzing program effectiveness</li>
                  <li>Reporting results to stakeholders</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleNext} className="flex items-center gap-2">
              Next Step <ArrowRightCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
