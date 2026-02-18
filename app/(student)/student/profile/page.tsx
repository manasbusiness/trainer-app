import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    return (
        <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Profile Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">Current Password</Label>
                            <Input id="current" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new">New Password</Label>
                            <Input id="new" type="password" />
                        </div>
                        <Button>Update Password</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
