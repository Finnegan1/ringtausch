"use client";

import { User } from "@prisma/client";
import { ChangeEvent, useState } from "react";

import { updateUserData } from "@/actions/updateUser";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormProps = {
  initialData: User;
};

export function UserForm({ initialData }: FormProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);
  console.log("gi");

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <ThemeToggle />
      </CardHeader>

      {editing ? (
        <form>
          <CardContent>username: {formData.name}</CardContent>
          <CardContent>
            name: {formData.firstName} {formData.lastName}
          </CardContent>
          <CardContent>email: {formData.email}</CardContent>
          <CardContent>
            <Label htmlFor="street">street</Label>
            <Input type="text" name="street" value={formData.street} onChange={handleOnChange} />
          </CardContent>
          <CardContent>
            <Label htmlFor="houseNumber">houseNumber</Label>
            <Input
              type="text"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleOnChange}
            />
          </CardContent>
          <CardContent>
            <Label htmlFor="postalCode">postalCode</Label>
            <Input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleOnChange}
            />
          </CardContent>
          <CardContent>
            <Label htmlFor="city">city</Label>
            <Input type="text" name="city" value={formData.city} onChange={handleOnChange} />
          </CardContent>
          <CardContent>
            <Button
              type="submit"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setFormData(await updateUserData(formData));
                setLoading(false);
              }}
            >
              {loading ? "Speichern..." : "Speichern"}
            </Button>
          </CardContent>
        </form>
      ) : (
        <>
          <CardContent>username: {formData.name}</CardContent>
          <CardContent>
            name: {formData.firstName} {formData.lastName}
          </CardContent>
          <CardContent>email: {formData.email}</CardContent>
          <CardContent>street: {formData.street}</CardContent>
          <CardContent>housenumber: {formData.houseNumber}</CardContent>
          <CardContent>
            city: {formData.postalCode} {formData.city}
          </CardContent>
          <CardContent>postelcode: {formData.postalCode}</CardContent>
          <Button onClick={() => setEditing(true)}>Bearbeiten</Button>
        </>
      )}
    </Card>
  );
}
