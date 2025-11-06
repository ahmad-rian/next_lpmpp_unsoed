import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Make&nbsp;</span>
        <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
        <br />
        <span className={title()}>
          websites regardless of your design experience.
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern React UI library.
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div>

      {session?.user && (
        <div className="mt-8 rounded-lg border p-6 shadow-md max-w-md w-full">
          <h3 className="text-xl font-bold mb-2">✅ Logged in as Admin</h3>
          <p className="text-sm text-default-600 mb-1">
            Email: {session.user.email}
          </p>
          <p className="text-sm text-default-600 mb-4">
            Role: {session.user.role}
          </p>
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "lg",
              variant: "shadow",
              class: "w-full",
            })}
            href="/admin"
          >
            Go to Admin Dashboard →
          </Link>
        </div>
      )}
    </section>
  );
}
