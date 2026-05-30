import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import RecentActivity from "@/components/RecentActivity";
import ProgressChart from "@/components/ProgressChart";
import { adminFirestore } from "@/lib/firebase-admin";

export default async function UserDashboardPage() {
  const user = await getCurrentUser() as any;

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch real user data from Firestore
  const userDoc = await adminFirestore.collection("users").doc(user.uid).get();
  const userData = userDoc.data() || {};

  // Fetch recent results (for Recent Activity and Progress Chart)
  let allResults: any[] = [];
  try {
    const resultsSnapshot = await adminFirestore
      .collection("results")
      .where("userId", "==", user.uid)
      .orderBy("timestamp", "desc")
      .limit(20)
      .get();

    allResults = resultsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp ? {
          seconds: data.timestamp.seconds,
          nanoseconds: data.timestamp.nanoseconds,
        } : null,
      };
    });
  } catch (e: any) {
    console.warn(
      "Firestore index missing, falling back to in-memory sort:",
      e.message,
    );
    const resultsSnapshot = await adminFirestore
      .collection("results")
      .where("userId", "==", user.uid)
      .get();

    allResults = resultsSnapshot.docs
      .map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? {
            seconds: data.timestamp.seconds,
            nanoseconds: data.timestamp.nanoseconds,
          } : null,
        };
      })
      .sort((a, b) => {
        const timeA = a.timestamp ? (a.timestamp.seconds * 1000) : 0;
        const timeB = b.timestamp ? (b.timestamp.seconds * 1000) : 0;
        return timeB - timeA;
      });
  }

  const recentResults = allResults.slice(0, 5);
  const chartResults = [...allResults].reverse(); // Oldest to newest for chart

  const totalExams = userData.totalExams || 0;
  const avgScore =
    totalExams > 0 ? Math.round((userData.totalScore || 0) / totalExams) : 0;
  const userStreak = userData.streak || 0;

  // Calculate real rank
  const totalScore = userData.totalScore || 0;
  const higherScoreCount = await adminFirestore
    .collection("users")
    .where("totalScore", ">", totalScore)
    .count()
    .get();
  const rank = higherScoreCount.data().count + 1;

  // Get total student count
  const totalUsersCount = await adminFirestore
    .collection("users")
    .count()
    .get();
  const totalUsers = totalUsersCount.data().count;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back,{" "}
          {userData.displayName || user.displayName || user.email?.split("@")[0]}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExams}</div>
            <p className="text-xs text-muted-foreground">
              Completed assessments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{rank}</div>
            <p className="text-xs text-muted-foreground">
              Out of {totalUsers} students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.98 7.98 0 01-2.343 5.657z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStreak} Day{userStreak !== 1 ? "s" : ""}
            </div>
            <p className="text-xs text-muted-foreground">
              {userStreak > 0 ? "Keep it up!" : "Start your streak today"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Your examination progress over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] border-t border-border mt-4 pt-6">
            {totalExams > 5 ? (
              <ProgressChart data={chartResults} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-2 text-center">
                <p className="text-muted-foreground italic">
                  Complete {6 - totalExams} more exam{6 - totalExams !== 1 ? "s" : ""} to unlock your progress chart.
                </p>
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(totalExams / 6) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">
                  {totalExams} / 6 Exams
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your last 5 exam attempts.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity results={recentResults} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
