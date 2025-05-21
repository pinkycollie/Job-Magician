import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobSpecialistCycle } from "@/components/job-specialist-cycle"
import { ServiceIntegration } from "@/components/service-integration"
import { ClientDashboard } from "@/components/client-dashboard"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <h1 className="text-4xl font-bold text-center mb-2 text-primary">360 Business Magician</h1>
          <p className="text-xl text-center text-muted-foreground mb-8">
            Vocational Rehabilitation Services Powered by Texas Workforce Solutions
          </p>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl">Integrated Services Platform</CardTitle>
              <CardDescription>
                Connecting job seekers with Texas Workforce Solutions resources through 360 Business Magician
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ServiceIntegration />
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline">Learn More</Button>
              <Button>Get Started</Button>
            </CardFooter>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-center">Job Specialist Cycle</h2>
          <JobSpecialistCycle />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">Client Services Dashboard</h2>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="placement">Placement</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <ClientDashboard tab="overview" />
            </TabsContent>
            <TabsContent value="assessment">
              <ClientDashboard tab="assessment" />
            </TabsContent>
            <TabsContent value="training">
              <ClientDashboard tab="training" />
            </TabsContent>
            <TabsContent value="placement">
              <ClientDashboard tab="placement" />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  )
}
