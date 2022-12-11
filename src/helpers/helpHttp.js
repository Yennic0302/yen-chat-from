export const helpHttp = () => {
  const customFeth = (endpoint, options) => {
    const defaultHeaders = {
      accept: "application/json",
    };

    const controller = new AbortController();
    options.signal = controller.signal;

    options.method = options.method || "GET";

    options.headers = options.headers
      ? { ...defaultHeaders, ...options.headers }
      : defaultHeaders;

    options.body = JSON.stringify(options.body) || false;
    if (!options.body) delete options.body;

    // console.log(options);
    setTimeout(() => controller.abort(), 10000);

    return fetch(endpoint, options)
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject({
              error: true,
              status: res.status || "00",
              statusText: res.statusText || "a error",
            })
      )
      .catch((err) => err);
  };

  const get = (url, options = {}) => customFeth(url, options);
  const post = (url, options = {}) => {
    options.method = "POST";
    return customFeth(url, options);
  };
  const put = (url, options = {}) => {
    options.method = "PUT";
    return customFeth(url, options);
  };
  const del = (url, options = {}) => {
    options.method = "DELETE";
    return customFeth(url, options);
  };

  return { get, post, put, del };
};
