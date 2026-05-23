"use client"

import Link from "next/link"
import { ArrowRight, Brain, Sparkles, Zap, GitBranch, Database, BarChart3, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background */}
      <section className="relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[url('/abstract-neural-network-connections-dark-blue-purp.jpg')] bg-cover bg-center opacity-10" />

        {/* Floating orbs */}
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float" />
        <div
          className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-secondary/30 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="container relative mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-5xl">
            {/* Badge */}
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary animate-glow" />
                <span className="text-sm font-medium text-primary">Powered by Advanced AI Algorithms</span>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="mb-6 text-balance text-center text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
              The Future of
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}
                Machine Learning{" "}
              </span>
              Training
            </h1>

            <p className="mx-auto mb-12 max-w-3xl text-balance text-center text-lg text-muted-foreground lg:text-xl">
              Transform your data into insights with our cutting-edge ML platform. Train models in minutes, visualize
              results instantly, and export with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="group h-14 px-10 text-base bg-primary hover:bg-primary/90">
                <Link href="/platform">
                  Start Training Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-10 text-base border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80"
              >
                <Link href="#algorithms">Explore 10+ Algorithms</Link>
              </Button>
            </div>

            {/* Hero Image */}
            <div className="mt-16 overflow-hidden rounded-xl border border-border/50 bg-card/30 p-4 backdrop-blur-sm">
              <img src="/modern-ml-dashboard-with-graphs-charts-neural-netw.jpg" alt="ML Platform Dashboard" className="w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* What is ML Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-balance text-4xl font-bold text-foreground lg:text-5xl">
              What is Machine Learning?
            </h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Machine Learning enables computers to learn from data and make intelligent predictions without explicit
              programming. Our platform makes this powerful technology accessible to everyone.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/80">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-foreground">Learn from Data</h3>
                <p className="text-muted-foreground">
                  Algorithms analyze patterns in your datasets to discover hidden insights and build predictive models
                  automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-secondary/50 hover:bg-card/80">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
                  <Brain className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-foreground">Make Predictions</h3>
                <p className="text-muted-foreground">
                  Trained models predict outcomes for new data with remarkable accuracy, enabling data-driven decision
                  making.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-card/80">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-foreground">Improve Over Time</h3>
                <p className="text-muted-foreground">
                  Models continuously refine their predictions as they process more data, becoming more accurate with
                  experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Showcase with Image */}
      <section className="relative overflow-hidden py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
                <Sparkles className="h-3 w-3 text-accent" />
                <span className="text-xs font-medium text-accent">Professional Grade</span>
              </div>
              <h2 className="mb-6 text-balance text-4xl font-bold text-foreground lg:text-5xl">
                Visualize Your Data Like Never Before
              </h2>
              <p className="mb-8 text-pretty text-lg text-muted-foreground">
                Our platform provides stunning visualizations for every algorithm. See decision trees, cluster plots,
                confusion matrices, and more in real-time as you train your models.
              </p>
              <ul className="space-y-4">
                {[
                  "Interactive charts and graphs",
                  "Real-time training metrics",
                  "Export-ready visualizations",
                  "Custom preprocessing tools",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl" />
              <img
                src="/beautiful-data-visualization-dashboard-with-colorf.jpg"
                alt="Data Visualization"
                className="relative rounded-xl border border-border/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section id="algorithms" className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-4xl font-bold text-foreground lg:text-5xl">
              10+ Powerful Algorithms
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              Industry-standard machine learning algorithms for classification, regression, and clustering. Choose the
              perfect model for your use case.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { name: "Decision Tree", icon: GitBranch, color: "primary", desc: "Interpretable tree-based decisions" },
              { name: "Random Forest", icon: Network, color: "secondary", desc: "Ensemble of decision trees" },
              { name: "Neural Network", icon: Brain, color: "accent", desc: "Deep learning capabilities" },
              { name: "K-Means", icon: Database, color: "primary", desc: "Clustering similar data points" },
              { name: "SVM", icon: Zap, color: "secondary", desc: "Maximum margin classifier" },
              { name: "Naive Bayes", icon: BarChart3, color: "accent", desc: "Probabilistic classifier" },
              { name: "KNN", icon: Network, color: "primary", desc: "Neighbor-based predictions" },
              { name: "Regression Models", icon: BarChart3, color: "secondary", desc: "Linear, Polynomial, Ridge" },
            ].map((algo, i) => {
              const Icon = algo.icon
              return (
                <Card
                  key={i}
                  className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/50 hover:bg-card/80"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${algo.color}/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                  <CardContent className="relative p-6">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-${algo.color}/10`}>
                      <Icon className={`h-6 w-6 text-${algo.color}`} />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{algo.name}</h3>
                    <p className="text-sm text-muted-foreground">{algo.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-balance text-4xl font-bold text-foreground lg:text-5xl">
                Simple 3-Step Workflow
              </h2>
              <p className="text-pretty text-lg text-muted-foreground">From data upload to trained model in minutes</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Upload Data",
                  desc: "Drag & drop your CSV file or click to browse",
                  icon: Database,
                },
                {
                  step: "02",
                  title: "Preprocess",
                  desc: "Clean data, handle missing values, normalize features",
                  icon: Zap,
                },
                {
                  step: "03",
                  title: "Train & Export",
                  desc: "Choose an algorithm, train your model, and export results",
                  icon: Brain,
                },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="relative">
                    {i < 2 && (
                      <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-primary to-secondary lg:block" />
                    )}
                    <Card className="relative border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-8 text-center">
                        <div className="mb-6 flex justify-center">
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                            <Icon className="h-10 w-10 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="mb-2 text-sm font-bold text-primary">STEP {item.step}</div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-balance text-4xl font-bold text-foreground lg:text-6xl">
              Ready to Transform Your Data?
            </h2>
            <p className="mb-10 text-pretty text-xl text-muted-foreground">
              Join thousands of data scientists and ML engineers using our platform to build powerful models.
            </p>
            <Button asChild size="lg" className="group h-16 px-12 text-lg bg-primary hover:bg-primary/90">
              <Link href="/platform">
                Let's Start Training
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">ML Platform</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              The fastest way to train machine learning models
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
