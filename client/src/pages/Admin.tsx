import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Building2, FlaskConical, Code, MessageSquare, Calendar } from "lucide-react";
import type { WaitlistSignup } from "@shared/schema";
import { format } from "date-fns";

export default function Admin() {
  const { data, isLoading, error } = useQuery<{ success: boolean; signups: WaitlistSignup[] }>({
    queryKey: ["/api/waitlist"],
  });

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="heading-admin">
            Waitlist Signups
          </h1>
          <p className="text-muted-foreground">
            View and manage all waitlist registrations
          </p>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive" data-testid="text-error">
                Failed to load waitlist signups. Please try again.
              </p>
            </CardContent>
          </Card>
        )}

        {data && data.signups && (
          <>
            <div className="mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Signups</p>
                      <p className="text-2xl font-bold" data-testid="text-total-signups">
                        {data.signups.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">With Institution</p>
                      <p className="text-2xl font-bold">
                        {data.signups.filter((s) => s.institution).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">With Challenge Details</p>
                      <p className="text-2xl font-bold">
                        {data.signups.filter((s) => s.challenge).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {data.signups.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No waitlist signups yet.
                  </CardContent>
                </Card>
              ) : (
                data.signups.map((signup) => (
                  <Card key={signup.id} data-testid={`card-signup-${signup.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{signup.name}</CardTitle>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <a
                                href={`mailto:${signup.email}`}
                                className="hover:text-primary transition-colors"
                                data-testid={`link-email-${signup.id}`}
                              >
                                {signup.email}
                              </a>
                            </div>
                            {signup.institution && (
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <span>{signup.institution}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(signup.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FlaskConical className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Research Area</span>
                        </div>
                        <Badge variant="secondary">{signup.researchArea}</Badge>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Software Tools</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {signup.software.map((tool, index) => (
                            <Badge key={index} variant="outline">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {signup.challenge && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Challenge</span>
                          </div>
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                            {signup.challenge}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
