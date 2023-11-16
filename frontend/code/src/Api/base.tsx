import axios from "axios";

const apiWithoutManager = axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
});

const ConcurrencyManager = (axios: any, MAX_CONCURRENT = 10) => {
  if (MAX_CONCURRENT < 1){
      //eslint-disable-next-line
    throw "Concurrency Manager Error: minimun concurrent requests is 1";
  }
  let instance = {
    queue: [] as any[],
    running: [] as any[],
    shiftInitial: () => {
      setTimeout(() => {
        if (instance.running.length < MAX_CONCURRENT) {
          instance.shift();
        }
      }, 0);
    },
    push: (reqHandler: any) => {
      instance.queue.push(reqHandler);
      instance.shiftInitial();
    },
    shift: () => {
      if (instance.queue.length) {
        const queued = instance.queue.shift();
        queued.resolver(queued.request);
        instance.running.push(queued);
      }
    },
    // Use as interceptor. Queue outgoing requests
    requestHandler: (req: any) => {
      return new Promise(resolve => {
        instance.push({ request: req, resolver: resolve });
      });
    },
    // Use as interceptor. Execute queued request upon receiving a response
    responseHandler: (res: any) => {
      instance.running.shift();
      instance.shift();
      return res;
    },
    responseErrorHandler: async (error: any) => {
      if (error?.response?.status === 401) {
        try {
          const refreshError = await apiWithoutManager.get("auth/refresh").then(() => null).catch((err: any) => err);
          if (refreshError && window.location.pathname !== '/') {
            instance.queue = [];
            instance.running = [];
            window.location.href = '/';
            return;
          }
          const res = await apiWithoutManager.request(error.config);
          return instance.responseHandler(res);
        } catch (refreshError) { }
      }
      return Promise.reject(instance.responseHandler(error));
    },
    interceptors: {
      request: null,
      response: null
    },
    detach: () => {
      axios.interceptors.request.eject(instance.interceptors.request);
      axios.interceptors.response.eject(instance.interceptors.response);
    }
  };
  // queue concurrent requests
  instance.interceptors.request = axios.interceptors.request.use(
    instance.requestHandler
  );
  instance.interceptors.response = axios.interceptors.response.use(
    instance.responseHandler,
    instance.responseErrorHandler,
  );
  return instance;
};

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
});

// init your manager.
ConcurrencyManager(api, 1);

export default api;
