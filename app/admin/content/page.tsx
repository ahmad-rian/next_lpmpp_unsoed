import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-default-500 mt-2">
            Create and manage website content
          </p>
        </div>
        <Button color="primary">Create New Content</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-xl font-bold">📄 Pages</h3>
          </CardHeader>
          <CardBody className="p-6">
            <p className="text-default-500 mb-4">
              Manage static pages and landing pages
            </p>
            <Button variant="flat" className="w-full">
              Manage Pages
            </Button>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-xl font-bold">📝 Blog Posts</h3>
          </CardHeader>
          <CardBody className="p-6">
            <p className="text-default-500 mb-4">
              Create and edit blog articles
            </p>
            <Button variant="flat" className="w-full">
              Manage Posts
            </Button>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-xl font-bold">🖼️ Media</h3>
          </CardHeader>
          <CardBody className="p-6">
            <p className="text-default-500 mb-4">
              Upload and manage media files
            </p>
            <Button variant="flat" className="w-full">
              Media Library
            </Button>
          </CardBody>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-0 pt-6 px-6">
          <h3 className="text-xl font-bold">Recent Content</h3>
        </CardHeader>
        <CardBody className="p-6">
          <p className="text-center text-default-500 py-8">
            No content yet. Start creating your first content!
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
