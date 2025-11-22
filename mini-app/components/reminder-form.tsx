"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function ReminderForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(setPermission);
    }
  }, []);

  const scheduleNotification = () => {
    if (!permission || permission !== "granted") return;
    const due = new Date(`${date}T${time}`);
    const now = new Date();
    const delay = due.getTime() - now.getTime();
    if (delay <= 0) {
      alert("Due time must be in the future");
      return;
    }
    setTimeout(() => {
      new Notification("Reminder", {
        body: text,
        icon: photo ? URL.createObjectURL(photo) : undefined,
      });
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleNotification();
    alert("Reminder set!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="text">Reminder Text</Label>
        <Textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="photo">Attach Photo (optional)</Label>
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
        />
      </div>
      <Button type="submit" className="w-full">
        Set Reminder
      </Button>
    </form>
  );
}
