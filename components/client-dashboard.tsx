import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, GraduationCap, Briefcase, CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface ClientDashboardProps {
  tab: "overview" | "assessment" | "training" | "placement"
}

export function ClientDashboard({ tab }: ClientDashboardProps) {
  if (tab === "overview") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Progress</CardTitle>
            <CardDescription>Overall progress through the program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Assessment</span>
                  <span className="text-sm text-muted-foreground">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Training</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Job Search</span>
                  <span className="text-sm text-muted-foreground">30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Placement</span>
                  <span className="text-sm text-muted-foreground">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Scheduled meetings and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg border">
                <Calendar className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Skills Assessment Review</h4>
                  <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                  <Badge className="mt-2">Texas Workforce Center</Badge>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg border">
                <Calendar className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Resume Workshop</h4>
                  <p className="text-sm text-muted-foreground">March 15, 2:00 PM</p>
                  <Badge className="mt-2">Virtual</Badge>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg border">
                <Calendar className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Job Fair Preparation</h4>
                  <p className="text-sm text-muted-foreground">March 20, 11:00 AM</p>
                  <Badge className="mt-2">360 Business Magician Office</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Program Eligibility</CardTitle>
            <CardDescription>Texas Workforce Solutions program eligibility status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">WIOA Adult</h4>
                  <p className="text-xs text-muted-foreground">Eligible</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Vocational Rehabilitation</h4>
                  <p className="text-xs text-muted-foreground">Eligible</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Clock className="h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="font-medium">Trade Adjustment Assistance</h4>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (tab === "assessment") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment Results</CardTitle>
            <CardDescription>Completed on February 28, 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Skill Proficiency</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Technical Skills</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Problem Solving</span>
                      <span className="text-sm text-muted-foreground">70%</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Digital Literacy</span>
                      <span className="text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Career Interest Areas</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Information Technology</Badge>
                  <Badge variant="secondary">Administrative Support</Badge>
                  <Badge variant="secondary">Customer Service</Badge>
                  <Badge variant="secondary">Healthcare Support</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Recommended Career Paths</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border">
                    <h5 className="font-medium">IT Support Specialist</h5>
                    <p className="text-sm text-muted-foreground">Match Score: 85%</p>
                  </div>

                  <div className="p-3 rounded-lg border">
                    <h5 className="font-medium">Administrative Assistant</h5>
                    <p className="text-sm text-muted-foreground">Match Score: 80%</p>
                  </div>

                  <div className="p-3 rounded-lg border">
                    <h5 className="font-medium">Customer Service Representative</h5>
                    <p className="text-sm text-muted-foreground">Match Score: 75%</p>
                  </div>

                  <div className="p-3 rounded-lg border">
                    <h5 className="font-medium">Medical Records Technician</h5>
                    <p className="text-sm text-muted-foreground">Match Score: 70%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Download Full Assessment Report</Button>
        </div>
      </div>
    )
  }

  if (tab === "training") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Plan</CardTitle>
            <CardDescription>Personalized development program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/50">
                  <GraduationCap className="h-10 w-10 text-primary flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Microsoft Office Specialist Certification</h4>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Comprehensive training in Microsoft Word, Excel, and PowerPoint
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        View Modules
                      </Button>
                      <Button size="sm">Continue Training</Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border">
                  <GraduationCap className="h-10 w-10 text-primary flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Customer Service Excellence</h4>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Training in customer service best practices and conflict resolution
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Starts: March 20, 2025</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border">
                  <GraduationCap className="h-10 w-10 text-primary flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Basic Web Development</h4>
                      <Badge variant="outline">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Introduction to HTML, CSS, and basic JavaScript
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm">Enroll</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Completed Training</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <h5 className="font-medium">Resume Writing Workshop</h5>
                      <p className="text-xs text-muted-foreground">Completed on February 15, 2025</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <h5 className="font-medium">Interview Skills Training</h5>
                      <p className="text-xs text-muted-foreground">Completed on February 22, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (tab === "placement") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Search Progress</CardTitle>
            <CardDescription>Track your job applications and interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Active Job Applications</h4>
                  <p className="text-sm text-muted-foreground">Last updated: March 10, 2025</p>
                </div>
                <Button>Add New Application</Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border">
                  <Briefcase className="h-10 w-10 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">Administrative Assistant</h4>
                        <p className="text-sm">ABC Corporation</p>
                      </div>
                      <Badge>Interview Scheduled</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Applied: March 5, 2025</p>
                    <p className="text-sm text-muted-foreground">Interview: March 15, 2025 at 2:00 PM</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm">Prepare for Interview</Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border">
                  <Briefcase className="h-10 w-10 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">Customer Service Representative</h4>
                        <p className="text-sm">XYZ Services</p>
                      </div>
                      <Badge variant="outline">Application Submitted</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Applied: March 8, 2025</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm">Check Status</Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border">
                  <Briefcase className="h-10 w-10 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">IT Support Technician</h4>
                        <p className="text-sm">Tech Solutions Inc.</p>
                      </div>
                      <Badge variant="secondary">Draft</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Started: March 9, 2025</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        Edit Application
                      </Button>
                      <Button size="sm">Submit Application</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Recommended Job Openings</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium">Office Administrator</h5>
                      <p className="text-xs">Local Government Office</p>
                      <p className="text-xs text-muted-foreground">Posted: March 7, 2025</p>
                      <Button size="sm" variant="link" className="p-0 h-auto mt-1">
                        View Job Details
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium">Help Desk Support</h5>
                      <p className="text-xs">Regional Healthcare System</p>
                      <p className="text-xs text-muted-foreground">Posted: March 9, 2025</p>
                      <Button size="sm" variant="link" className="p-0 h-auto mt-1">
                        View Job Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
