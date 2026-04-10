# SWR Data Fetching Architecture

This document describes the scalable data fetching architecture using SWR (stale-while-revalidate) implemented across both the root and landing applications.

## Overview

SWR is a data fetching strategy that displays cached data first (stale), then fetches fresh data (revalidate), and finally updates with the latest data. This provides a fast, reactive user experience with automatic caching and revalidation.

## Architecture

### Directory Structure

```
lib/
├── api/
│   ├── client.ts       # Centralized HTTP client
│   └── types.ts        # API response types
└── swr/
    ├── config.ts       # Global SWR configuration
    └── provider.tsx    # SWRConfig wrapper component

hooks/
├── use-fetch.ts        # Generic data fetching hook
├── use-mutation.ts     # Generic mutation hook
└── api/
    └── use-auth.ts     # Domain-specific auth hooks
```

### Core Components

#### 1. API Client (`lib/api/client.ts`)

Centralized HTTP client with:
- Automatic error handling
- Request timeout management
- Credential inclusion for auth
- TypeScript type safety
- Logging integration (root app only)

**Usage:**
```typescript
import { apiClient } from "@/lib/api/client";

// GET request
const users = await apiClient.get<User[]>("/api/users");

// POST request
const newUser = await apiClient.post<User>("/api/users", {
  name: "John",
  email: "john@example.com",
});
```

#### 2. SWR Configuration (`lib/swr/config.ts`)

Global settings for all SWR hooks:
- Revalidation behavior
- Cache deduplication
- Error retry logic
- Global error/success handlers

#### 3. SWR Provider (`lib/swr/provider.tsx`)

Wraps the application with SWRConfig. Already integrated in:
- `app/layout.tsx` (root)
- `landing/app/layout.tsx` (landing)

#### 4. Generic Hooks

**`useFetch<T>` Hook:**
```typescript
import { useFetch } from "@/hooks/use-fetch";

function UserProfile() {
  const { data, error, isLoading } = useFetch<User>("/api/user");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Hello, {data?.name}!</div>;
}
```

**`useMutation<T>` Hook:**
```typescript
import { useMutation } from "@/hooks/use-mutation";

function CreateUser() {
  const { trigger, isLoading, error } = useMutation<User, CreateUserData>(
    "/api/users",
    "POST",
    {
      onSuccess: (user) => console.log("Created:", user),
      revalidate: "/api/users", // Refresh users list
    }
  );

  const handleSubmit = async (data: CreateUserData) => {
    await trigger(data);
  };
}
```

**`usePaginatedFetch<T>` Hook:**
```typescript
import { usePaginatedFetch } from "@/hooks/use-fetch";

function ItemList() {
  const { data, page, setPage, pageSize } = usePaginatedFetch<Item[]>(
    "/api/items",
    { pageSize: 20 }
  );

  return (
    <>
      <ItemGrid items={data} />
      <Pagination page={page} onPageChange={setPage} />
    </>
  );
}
```

#### 5. Domain-Specific Hooks

Pre-built hooks for common operations. Currently implemented:

**Authentication Hooks (`hooks/api/use-auth.ts`):**

```typescript
import { useSession, useLogin, useRegister, useLogout } from "@/hooks/api/use-auth";

// Check current session
const { data: session, isLoading } = useSession();

// Login
const { trigger: login, isLoading: loginLoading } = useLogin({
  onSuccess: () => router.push("/dashboard"),
});

await login({ email, password });

// Register
const { trigger: register } = useRegister({
  onSuccess: () => router.push("/welcome"),
});

await register({ name, email, password });

// Logout
const { trigger: logout } = useLogout({
  onSuccess: () => router.push("/"),
});

await logout();
```

## Migration Guide

### From Manual Fetch to SWR

**Before (Manual fetch with useEffect):**
```typescript
function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Hello, {user?.name}!</div>;
}
```

**After (SWR):**
```typescript
function UserProfile() {
  const { data: user, error, isLoading } = useFetch<User>("/api/user");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Hello, {user?.name}!</div>;
}
```

### Benefits of Migration

1. **Automatic Caching**: Data is cached and reused across components
2. **Revalidation**: Automatically updates data when window regains focus
3. **Deduplication**: Multiple requests to same endpoint are deduplicated
4. **Error Retry**: Automatic retry on failure with exponential backoff
5. **Type Safety**: Full TypeScript support with generics
6. **Less Code**: No manual state management or useEffect

## Best Practices

### 1. Key Naming

Use consistent URL-based keys:
```typescript
// ✅ Good
useFetch<User>("/api/user");
useFetch<Post[]>(`/api/posts?userId=${userId}`);

// ❌ Avoid custom keys unless necessary
useFetch<User>("user-data");
```

### 2. Conditional Fetching

Use `null` to disable fetching:
```typescript
const { data } = useFetch<User>(
  userId ? `/api/users/${userId}` : null
);
```

### 3. Optimistic Updates

Use mutations with optimistic updates for instant UI feedback:
```typescript
const { trigger } = useMutation<Todo, UpdateTodoData>(
  `/api/todos/${id}`,
  "PATCH",
  {
    onMutate: (newData) => {
      // Update UI immediately
      mutate(`/api/todos/${id}`, newData, false);
    },
    onError: () => {
      // Revert on error
      mutate(`/api/todos/${id}`);
    },
  }
);
```

### 4. Revalidation Control

Customize revalidation behavior per hook:
```typescript
// Static data - no revalidation needed
const { data } = useFetch<Country[]>("/api/countries", {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
});

// Real-time data - frequent revalidation
const { data } = useFetch<Order[]>("/api/orders", {
  refreshInterval: 5000, // Poll every 5 seconds
});
```

### 5. Error Handling

Handle errors gracefully:
```typescript
const { data, error } = useFetch<User>("/api/user");

if (error) {
  if (error.statusCode === 401) {
    return <Redirect to="/login" />;
  }
  return <ErrorAlert message={error.message} />;
}
```

## Creating New Hooks

### Generic Data Fetching Hook

For simple GET requests, use `useFetch` directly:
```typescript
export function useUsers() {
  return useFetch<User[]>("/api/users");
}
```

### Domain-Specific Mutation Hook

For complex operations, create custom hooks:
```typescript
// hooks/api/use-posts.ts
export function useCreatePost(options?: {
  onSuccess?: (post: Post) => void;
}) {
  return useMutation<Post, CreatePostData>(
    "/api/posts",
    "POST",
    {
      revalidate: ["/api/posts", "/api/feed"],
      ...options,
    }
  );
}

export function useUpdatePost(postId: string, options?: {
  onSuccess?: (post: Post) => void;
}) {
  return useMutation<Post, UpdatePostData>(
    `/api/posts/${postId}`,
    "PATCH",
    {
      revalidate: ["/api/posts", `/api/posts/${postId}`],
      ...options,
    }
  );
}
```

## Advanced Patterns

### 1. Dependent Fetching

Fetch data based on previous response:
```typescript
const { data: user } = useFetch<User>("/api/user");
const { data: posts } = useFetch<Post[]>(
  user ? `/api/posts?userId=${user.id}` : null
);
```

### 2. Parallel Fetching

Fetch multiple endpoints simultaneously:
```typescript
const { data: user } = useFetch<User>("/api/user");
const { data: settings } = useFetch<Settings>("/api/settings");
const { data: notifications } = useFetch<Notification[]>("/api/notifications");
```

### 3. Manual Cache Management

```typescript
import { useSWRConfig } from "swr";

function MyComponent() {
  const { mutate } = useSWRConfig();

  const refreshAllUsers = () => {
    mutate("/api/users");
  };

  const clearCache = () => {
    mutate(
      (key) => typeof key === "string" && key.startsWith("/api"),
      undefined,
      { revalidate: false }
    );
  };
}
```

### 4. Middleware Pattern

Add custom middleware for logging, analytics, etc.:
```typescript
import { Middleware } from "swr";

const logger: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    
    useEffect(() => {
      console.log("SWR key:", key);
      console.log("Data:", swr.data);
    }, [swr.data]);

    return swr;
  };
};

// Add to SWRConfig
<SWRConfig value={{ use: [logger] }}>
  {children}
</SWRConfig>
```

## Troubleshooting

### Data Not Updating

1. Check if the key is changing when it should
2. Verify revalidation settings aren't disabled
3. Ensure `mutate()` is called after mutations

### Memory Leaks

1. Don't call hooks conditionally
2. Properly cleanup subscriptions
3. Use `null` key to disable fetching instead of conditional hooks

### Type Errors

1. Always provide generic type: `useFetch<YourType>(...)`
2. Ensure API response matches TypeScript interface
3. Check `ApiResponse<T>` wrapper in backend

## Future Enhancements

### Planned Features

1. **Infinite Loading**: Scroll-based pagination
2. **Prefetching**: Preload data on hover/intent
3. **WebSocket Integration**: Real-time updates via WebSockets
4. **Offline Support**: Cache-first strategy with sync
5. **Request Deduplication**: Advanced deduplication strategies
6. **Analytics Middleware**: Automatic performance tracking

### Creating Additional Hooks

Follow this structure when adding new domain hooks:

```typescript
// hooks/api/use-[domain].ts
export function use[Entity]() {
  return useFetch<EntityType>("/api/[entity]");
}

export function useCreate[Entity](options?: MutationOptions) {
  return useMutation<EntityType, CreateData>(
    "/api/[entity]",
    "POST",
    {
      revalidate: "/api/[entity]",
      ...options,
    }
  );
}

export function useUpdate[Entity](id: string, options?: MutationOptions) {
  return useMutation<EntityType, UpdateData>(
    `/api/[entity]/${id}`,
    "PATCH",
    {
      revalidate: ["/api/[entity]", `/api/[entity]/${id}`],
      ...options,
    }
  );
}

export function useDelete[Entity](id: string, options?: MutationOptions) {
  return useMutation<void, void>(
    `/api/[entity]/${id}`,
    "DELETE",
    {
      revalidate: "/api/[entity]",
      ...options,
    }
  );
}
```

## References

- [SWR Documentation](https://swr.vercel.app/)
- [API Client Implementation](../lib/api/client.ts)
- [Generic Hooks](../hooks/use-fetch.ts)
- [Auth Hooks Example](../hooks/api/use-auth.ts)
