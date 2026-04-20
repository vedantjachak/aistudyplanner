import { Skeleton } from "@/components/ui/skeleton";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const RemindersPage = lazy(() => import("./pages/RemindersPage"));
const PlanningPage = lazy(() => import("./pages/PlanningPage"));

function PageLoading() {
  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <DashboardPage />,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks",
  component: () => <TasksPage />,
});

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/insights",
  component: () => <InsightsPage />,
});

const remindersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reminders",
  component: () => <RemindersPage />,
});

const planningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/planning",
  component: () => <PlanningPage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  tasksRoute,
  insightsRoute,
  remindersRoute,
  planningRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
