import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Divider } from "@heroui/divider";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-default-500 mt-2">
          Configure system settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-xl font-bold">General Settings</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              <Input
                label="Site Name"
                placeholder="Enter site name"
                defaultValue="LPMPP UNSOED"
              />
              <Input
                label="Site Description"
                placeholder="Enter site description"
                defaultValue="Lembaga Pengembangan dan Penjaminan Mutu Pendidikan"
              />
              <Input
                label="Admin Email"
                placeholder="Enter admin email"
                defaultValue="alriansr@gmail.com"
                disabled
              />
              <Divider />
              <div className="flex justify-end gap-2">
                <Button variant="flat">Cancel</Button>
                <Button color="primary">Save Changes</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-xl font-bold">Authentication Settings</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Google OAuth</p>
                  <p className="text-sm text-default-500">
                    Allow users to sign in with Google
                  </p>
                </div>
                <Switch defaultSelected color="success" />
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Admin Only Mode</p>
                  <p className="text-sm text-default-500">
                    Only allow admin users to login
                  </p>
                </div>
                <Switch defaultSelected color="warning" />
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-default-500">
                    Automatically logout users after inactivity
                  </p>
                </div>
                <Switch defaultSelected color="primary" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-xl font-bold">Database Information</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-default-500">Database Type</span>
                <span className="font-medium">MySQL</span>
              </div>
              <Divider />
              <div className="flex justify-between">
                <span className="text-default-500">Database Name</span>
                <span className="font-medium">lpmpp_unsoed</span>
              </div>
              <Divider />
              <div className="flex justify-between">
                <span className="text-default-500">Status</span>
                <span className="text-success font-medium">Connected</span>
              </div>
              <Divider />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="flat" color="warning">
                  Backup Database
                </Button>
                <Button variant="flat" color="primary">
                  Run Migrations
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
