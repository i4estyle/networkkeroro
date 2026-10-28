(function() {
    function xhrFetch(url, options) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open((options && options.method) || "GET", url, true);
            xhr.withCredentials = true;
            if (options && options.headers) {
                var h = options.headers;
                if (h.forEach) {
                    h.forEach(function(val, key) { xhr.setRequestHeader(key, val); });
                } else {
                    for (var k in h) {
                        if (Object.prototype.hasOwnProperty.call(h, k)) xhr.setRequestHeader(k, h[k]);
                    }
                }
            }
            xhr.onload = function() {
                resolve({
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    json: function() { return Promise.resolve(JSON.parse(xhr.responseText)); },
                    text: function() { return Promise.resolve(xhr.responseText); }
                });
            };
            xhr.onerror = function() {
                reject(new TypeError("XHR request failed"));
            };
            xhr.send((options && options.body) || null);
        });
    }

    var origFetch = window.fetch;
    window.fetch = function(input, init) {
        if (window.location.href.indexOf('@') !== -1) {
            var urlStr = typeof input === 'string' ? input : (input && input.url ? input.url : '');
            return xhrFetch(urlStr, init);
        }
        try {
            return origFetch(input, init).catch(function(err) {
                if (err && (err.name === 'TypeError' || String(err).indexOf('credentials') !== -1)) {
                    var fallbackUrl = typeof input === 'string' ? input : (input && input.url ? input.url : '');
                    return xhrFetch(fallbackUrl, init);
                }
                return Promise.reject(err);
            });
        } catch (syncErr) {
            var fallbackUrl = typeof input === 'string' ? input : (input && input.url ? input.url : '');
            return xhrFetch(fallbackUrl, init);
        }
    };
})();
