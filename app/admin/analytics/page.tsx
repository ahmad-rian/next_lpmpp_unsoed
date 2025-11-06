import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-default-500 mt-2">
          Website statistics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md">
          <CardBody className="p-6">
            <p className="text-sm text-default-500">Page Views</p>
            <p className="text-3xl font-bold mt-2">12,345</p>
            <Chip color="success" variant="flat" size="sm" className="mt-3">
              +12% from last month
            </Chip>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardBody className="p-6">
            <p className="text-sm text-default-500">Unique Visitors</p>
            <p className="text-3xl font-bold mt-2">8,234</p>
            <Chip color="success" variant="flat" size="sm" className="mt-3">
              +8% from last month
            </Chip>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardBody className="p-6">
            <p className="text-sm text-default-500">Bounce Rate</p>
            <p className="text-3xl font-bold mt-2">42%</p>
            <Chip color="warning" variant="flat" size="sm" className="mt-3">
              -3% from last month
            </Chip>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardBody className="p-6">
            <p className="text-sm text-default-500">Avg. Session</p>
            <p className="text-3xl font-bold mt-2">3m 24s</p>
            <Chip color="success" variant="flat" size="sm" className="mt-3">
              +15% from last month
            </Chip>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-xl font-bold">Top Pages</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {[
                { path: "/", views: 3421 },
                { path: "/about", views: 2145 },
                { path: "/blog", views: 1876 },
                { path: "/docs", views: 1543 },
                { path: "/pricing", views: 987 },
              ].map((page, index) => (
                <div
                  key={page.path}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-default-500 font-mono text-sm">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{page.path}</span>
                  </div>
                  <Chip variant="flat" size="sm">
                    {page.views.toLocaleString()} views
                  </Chip>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-xl font-bold">Traffic Sources</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {[
                { source: "Direct", percentage: 45, color: "primary" },
                { source: "Google Search", percentage: 30, color: "success" },
                { source: "Social Media", percentage: 15, color: "warning" },
                { source: "Referral", percentage: 10, color: "secondary" },
              ].map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-sm text-default-500">
                      {source.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-default-200 rounded-full h-2">
                    <div
                      className={`bg-${source.color} h-2 rounded-full`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
