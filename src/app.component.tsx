import {
  RouterProvider,
  Router,
  Route,
  RootRoute,
} from "@tanstack/react-router";
import Log from "./routes/log";
import Root from "./routes/root";

const rootRoute = new RootRoute();

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Root,
});

// ✅ This path will capture anything in the path after `/users` and before the next slash
// eg. `/users/123` and `/users/123/details will both capture `123`
const logRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "logs/$logName",
  component: Log,
});

const routeTree = rootRoute.addChildren([indexRoute, logRoute]);

// Create the router using your route tree
const router = new Router({ routeTree, basepath: "/big-log-react" });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
