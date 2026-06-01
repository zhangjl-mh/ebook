export const requestJson = <T>(url: string): Promise<T> =>
  new Promise((resolve, reject) => {
    uni.request({
      url,
      method: 'GET',
      success: (res) => resolve((res.data || {}) as T),
      fail: reject
    });
  });
