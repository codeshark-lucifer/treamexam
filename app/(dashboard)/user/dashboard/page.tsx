import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="bg-[var(--surface)] p-6 rounded-[var(--radius)] border border-[var(--line)] shadow-sm">
        <h1 className="text-3xl font-bold text-[var(--primary)]">ផ្ទាំងគ្រប់គ្រង / Dashboard</h1>
        <p className="text-[var(--muted)] mt-1 font-medium">
          សូមស្វាគមន៍ត្រឡប់មកវិញ,{" "}
          <span className="text-[var(--primary)] font-bold">{userData.displayName || user.displayName || user.email?.split("@")[0]}</span>!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* STAT CARDS */}
        <div className="bg-[var(--surface)] p-5 rounded-[var(--radius)] border border-[var(--line)] shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
             <i className="fa-solid fa-clipboard-check"></i>
           </div>
           <div>
             <p className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">ការប្រឡងសរុប</p>
             <div className="text-2xl font-black text-[var(--ink)]">{totalExams}</div>
           </div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-[var(--radius)] border border-[var(--line)] shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xl">
             <i className="fa-solid fa-chart-line"></i>
           </div>
           <div>
             <p className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">ពិន្ទុមធ្យម</p>
             <div className="text-2xl font-black text-[var(--ink)]">{avgScore}%</div>
           </div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-[var(--radius)] border border-[var(--line)] shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xl">
             <i className="fa-solid fa-trophy"></i>
           </div>
           <div>
             <p className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">ចំណាត់ថ្នាក់</p>
             <div className="text-2xl font-black text-[var(--ink)]">#{rank}</div>
           </div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-[var(--radius)] border border-[var(--line)] shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl">
             <i className="fa-solid fa-fire"></i>
           </div>
           <div>
             <p className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">កម្រិតសកម្មភាព</p>
             <div className="text-2xl font-black text-[var(--ink)]">{userStreak} ថ្ងៃ</div>
           </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 bg-[var(--surface)] p-6 rounded-[var(--radius)] border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
               <i className="fa-solid fa-wave-square text-[var(--primary)]"></i>
               វឌ្ឍនភាព / Progress
            </h2>
          </div>
          
          <div className="h-[300px]">
            {totalExams > 5 ? (
              <ProgressChart data={chartResults} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                <div className="w-20 h-20 bg-[var(--secondary)] rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-lock text-[var(--primary)] text-2xl"></i>
                </div>
                <div>
                  <p className="text-[var(--muted)] font-bold italic mb-2">
                    បំពេញ {6 - totalExams} វិញ្ញាសាបន្ថែមទៀតដើម្បីបើកតារាងវឌ្ឍនភាព។
                  </p>
                  <div className="w-64 h-3 bg-[var(--line)] rounded-full overflow-hidden mx-auto border border-[var(--line)]">
                    <div
                      className="h-full bg-[var(--primary)] transition-all duration-1000"
                      style={{ width: `${(totalExams / 6) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--muted)] uppercase font-black mt-2 tracking-widest">
                    {totalExams} / 6 វិញ្ញាសា
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-[var(--surface)] p-6 rounded-[var(--radius)] border border-[var(--line)] shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
             <i className="fa-solid fa-clock-rotate-left text-[var(--primary)]"></i>
             សកម្មភាពថ្មីៗ / Activity
          </h2>
          <RecentActivity results={recentResults} />
        </div>
      </div>
    </div>
  );
}

