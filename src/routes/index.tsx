import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your App" },
      { name: "description", content: "Replace this with a one-sentence description of your app." },
      { property: "og:title", content: "Your App" },
      {
        property: "og:description",
        content: "Replace this with a one-sentence description of your app.",
      },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome</h1>
      <p className="max-w-md text-muted-foreground">
        Edit{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          src/routes/index.tsx
        </code>{" "}
        to get started.
      </p>
    </div>
  );
}
