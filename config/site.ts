export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ACME",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/products",
      children: [
        {
          label: "Analytics",
          href: "/products/analytics",
          description: "Get insights into your data",
          icon: "analytics",
        },
        {
          label: "Dashboard",
          href: "/products/dashboard",
          description: "Manage your account settings",
          icon: "dashboard",
        },
        {
          label: "Reports",
          href: "/products/reports",
          description: "View detailed reports",
          icon: "reports",
        },
      ],
    },
    {
      label: "Features",
      href: "/features",
      children: [
        {
          label: "Automation",
          href: "/features/automation",
          description: "Automate your workflows",
          icon: "automation",
        },
        {
          label: "Security",
          href: "/features/security",
          description: "Enterprise-grade security",
          icon: "security",
        },
        {
          label: "Integrations",
          href: "/features/integrations",
          description: "Connect with your tools",
          icon: "integrations",
        },
      ],
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
