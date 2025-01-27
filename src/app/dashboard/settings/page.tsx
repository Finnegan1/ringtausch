import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  )
}
