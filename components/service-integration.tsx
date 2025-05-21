"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ServiceIntegration() {
  const [activeTab, setActiveTab] = useState<"tws" | "magician" | "integration">("integration")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <Button
          variant={activeTab === "tws" ? "default" : "outline"}
          onClick={() => setActiveTab("tws")}
          className="flex-1"
        >
          Texas Workforce Solutions
        </Button>
        <Button
          variant={activeTab === "integration" ? "default" : "outline"}
          onClick={() => setActiveTab("integration")}
          className="flex-1"
        >
          Integration
        </Button>
        <Button
          variant={activeTab === "magician" ? "default" : "outline"}
          onClick={() => setActiveTab("magician")}
          className="flex-1"
        >
          360 Business Magician
        </Button>
      </div>

      {activeTab === "tws" && (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="Texas Workforce Solutions Logo"
                className="rounded-full"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-center mb-4">Texas Workforce Solutions Services</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Employment Services
                </h4>
                <p className="text-sm text-muted-foreground">
                  Job search assistance, career counseling, and placement services
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Training Programs
                </h4>
                <p className="text-sm text-muted-foreground">
                  Skills development, vocational training, and certification programs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Employer Resources
                </h4>
                <p className="text-sm text-muted-foreground">
                  Recruitment assistance, labor market information, and business services
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Support Services
                </h4>
                <p className="text-sm text-muted-foreground">
                  Childcare assistance, transportation aid, and other support services
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline" className="flex items-center gap-2">
              Visit Texas Workforce Solutions <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {activeTab === "magician" && (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="360 Business Magician Logo"
                className="rounded-full"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-center mb-4">360 Business Magician Services</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Personalized Career Coaching
                </h4>
                <p className="text-sm text-muted-foreground">One-on-one guidance and career development planning</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Skills Assessment
                </h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive evaluation of abilities, interests, and aptitudes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Job Readiness Training
                </h4>
                <p className="text-sm text-muted-foreground">
                  Resume building, interview preparation, and workplace skills
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Vocational Rehabilitation
                </h4>
                <p className="text-sm text-muted-foreground">Specialized services for individuals with disabilities</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline" className="flex items-center gap-2">
              Learn More About 360 Business Magician <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {activeTab === "integration" && (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <img
                src="/placeholder.svg?height=60&width=60"
                alt="Texas Workforce Solutions Logo"
                className="rounded-full"
              />
            </div>

            <ArrowRight className="h-8 w-8 text-primary" />

            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <img
                src="/placeholder.svg?height=60&width=60"
                alt="360 Business Magician Logo"
                className="rounded-full"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-center mb-4">Integrated Service Benefits</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Streamlined Access</h4>
                <p className="text-sm">
                  Single point of entry to both Texas Workforce Solutions and 360 Business Magician services
                </p>
                <Badge variant="secondary" className="mt-2">
                  TWS Resource
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Enhanced Support</h4>
                <p className="text-sm">
                  Comprehensive case management with specialized vocational rehabilitation expertise
                </p>
                <Badge variant="secondary" className="mt-2">
                  360 Business Magician
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Coordinated Services</h4>
                <p className="text-sm">Seamless coordination between state resources and specialized coaching</p>
                <Badge variant="secondary" className="mt-2">
                  Integrated Benefit
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">How the Integration Works</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Client registers through the integrated platform</li>
              <li>Assessment determines eligibility for Texas Workforce Solutions programs</li>
              <li>360 Business Magician provides specialized vocational rehabilitation services</li>
              <li>Job specialists coordinate resources from both systems</li>
              <li>Unified tracking system monitors progress and outcomes</li>
            </ol>
          </div>

          <div className="flex justify-center mt-4">
            <Button className="flex items-center gap-2">Start Your Journey Today</Button>
          </div>
        </div>
      )}
    </div>
  )
}
