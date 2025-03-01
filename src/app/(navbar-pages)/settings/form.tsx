"use client";

import { User } from "@prisma/client";
import { ChangeEvent, useState } from "react";

import { updateUserData } from "@/actions/updateUser";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FormProps = {
  initialData: User;
};

export function UserForm({ initialData }: FormProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Card className="w-full max-w-[600px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Einstellungen</CardTitle>
          <CardDescription>Verwalte deine persönlichen Daten</CardDescription>
        </div>
        <ThemeToggle />
      </CardHeader>
      <Separator />

      {editing ? (
        <form>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Persönliche Daten</TabsTrigger>
              <TabsTrigger value="address">Adresse</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 p-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nutzername</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleOnChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Vorname</Label>
                    <div className="rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                      {formData.firstName}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Nachname</Label>
                    <div className="rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                      {formData.lastName}
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>E-Mail</Label>
                  <div className="rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                    {formData.email}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-4 p-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 grid gap-2">
                    <Label htmlFor="street">Straße</Label>
                    <Input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="houseNumber">Hausnummer</Label>
                    <Input
                      type="text"
                      id="houseNumber"
                      name="houseNumber"
                      value={formData.houseNumber}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="postalCode">Postleitzahl</Label>
                    <Input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="col-span-2 grid gap-2">
                    <Label htmlFor="city">Stadt</Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <CardFooter className="flex justify-between border-t p-4">
            <Button
              variant="outline"
              onClick={() => {
                setFormData(initialData);
                setEditing(false);
              }}
            >
              Abbrechen
            </Button>
            <Button
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const update = await updateUserData(formData);
                setFormData(update);
                setEditing(false);
                setLoading(false);
              }}
            >
              {loading ? "Speichern..." : "Speichern"}
            </Button>
          </CardFooter>
        </form>
      ) : (
        <>
          <CardContent className="p-6">
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium">Persönliche Daten</h3>
                <Separator className="my-2" />
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="font-medium text-muted-foreground">Nutzername:</dt>
                  <dd>{formData.name || "-"}</dd>

                  <dt className="font-medium text-muted-foreground">Vorname:</dt>
                  <dd>{formData.firstName || "-"}</dd>

                  <dt className="font-medium text-muted-foreground">Nachname:</dt>
                  <dd>{formData.lastName || "-"}</dd>

                  <dt className="font-medium text-muted-foreground">E-Mail:</dt>
                  <dd>{formData.email || "-"}</dd>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium">Adresse</h3>
                <Separator className="my-2" />
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="font-medium text-muted-foreground">Straße:</dt>
                  <dd>{formData.street || "-"}</dd>

                  <dt className="font-medium text-muted-foreground">Hausnummer:</dt>
                  <dd>{formData.houseNumber || "-"}</dd>

                  <dt className="font-medium text-muted-foreground">Postleitzahl:</dt>
                  <dd>{formData.postalCode || "-"}</dd>

                  <dt className="font-medium text-muted-foreground">Stadt:</dt>
                  <dd>{formData.city || "-"}</dd>
                </dl>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t p-4">
            <Button onClick={() => setEditing(true)}>Bearbeiten</Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
