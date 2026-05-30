"use client";

import { useState } from "react";
import ExamReview from "./ExamReview";
import { Button } from "./ui/Button";

interface RecentActivityProps {
  results: any[];
}

export default function RecentActivity({ results }: RecentActivityProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground italic">
        No recent exams found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((res) => (
        <div key={res.id} className="space-y-3 border-b pb-4 last:border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold capitalize text-lg">
                {res.examTypeId.replace("-", " ")}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span>
                  {res.timestamp?.toDate 
                    ? res.timestamp.toDate().toLocaleDateString() 
                    : res.timestamp?.seconds 
                      ? new Date(res.timestamp.seconds * 1000).toLocaleDateString()
                      : "Recently"}
                </span>
                <span>•</span>
                <span>Category: {res.categoryId}</span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`text-xl font-black ${
                  res.score >= 80
                    ? "text-green-500"
                    : res.score >= 50
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {res.score}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] uppercase tracking-widest font-bold"
                onClick={() => setExpandedId(expandedId === res.id ? null : res.id)}
              >
                {expandedId === res.id ? "Hide Review" : "View Review"}
              </Button>
            </div>
          </div>

          {expandedId === res.id && res.answers && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <ExamReview answers={res.answers} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
