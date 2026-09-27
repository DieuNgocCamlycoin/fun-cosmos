export type IdeaDatabase = {
  prepare: (sql: string) => {
    bind: (...values: unknown[]) => {
      first: <T>() => Promise<T | null>;
      run: () => Promise<{ success: boolean }>;
      all: <T>() => Promise<{ results: T[] }>;
    };
  };
};

export type AppRequestContext = { ideaDb: IdeaDatabase | undefined };

declare module "@tanstack/react-router" {
  interface Register {
    server: { requestContext: AppRequestContext };
  }
}
